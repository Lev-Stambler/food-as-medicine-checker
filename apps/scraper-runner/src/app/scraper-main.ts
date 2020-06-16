import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as healthSiteScraper from '@foodmedicine/health-site-scraper';
import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ParsedArticle,
  ParsedArticleParagraph,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';

/**
 * Get the top percentage of an array
 * @param arr - an array sorted in descending order
 * @param scoreAccessor - the key to access the score
 * @param scoreCutOff - minimum score required
 */
function getTopScoringParagraphs<T>(
  arr: T[],
  scoreAccessor: string,
  scoreCutOff = 5
): T[] {
  return arr.filter((item) => item[scoreAccessor] >= scoreCutOff);
}

export async function main(opts?: {
  limit?: number;
  numberOfArticles?: number;
}) {
  const healthRemedies = await healthSiteScraper.runAllScrapers();
  const remediesProm = await healthRemedies.map(async (healthRemedy) => {
    // only use the first limit number of elements or use the whole array
    const recommendationsLimited = healthRemedy.recommendations.slice(
      0,
      opts?.limit || healthRemedy.recommendations.length
    );
    const recommendationResults = recommendationsLimited.map((recommendation) =>
      findCorrelatedParagraphs(
        healthRemedy.impacted,
        recommendation,
        opts?.numberOfArticles || 25
      )
    );
    return await Promise.all(recommendationResults);
  });
  await Promise.all(remediesProm);
  console.info('Done with all scraping');
}

async function findCorrelatedParagraphs(
  impacted: string,
  recommendation: string,
  numberOfArticles: number
) {
  console.info(
    `Starting to find correlation of ${recommendation} for ${impacted}`
  );
  const articleHeads = await scholarsScrape.runScholarsScraper(
    impacted,
    recommendation,
    numberOfArticles
  );
  const downloadProms: Promise<ParsedArticle>[] = articleHeads.map(
    async (articleHead) => {
      const evaluatedArticle: ParsedArticle = await articleParser.evaluateArticle(
        articleHead,
        articleParser.EbiParser
      );
      return evaluatedArticle;
    }
  );
  const allEvaluatedArticles: ParsedArticle[] = await Promise.all(
    downloadProms
  );
  const allParagraphsStandalone: ParsedArticleParagraphStandalone[] = [];
  allEvaluatedArticles.forEach((article) => {
    const standaloneParagraphs: ParsedArticleParagraphStandalone[] = article.paragraphs.map(
      (paragraph: ParsedArticleParagraph) => {
        return {
          head: article.head,
          // set default backsUpClaim to notApplicable. This later gets changed manually in the JSON file
          backsUpClaim: ArticleParagraphBacksUpClaim.notApplicable,
          ...paragraph,
        };
      }
    );
    allParagraphsStandalone.push(...standaloneParagraphs);
  });
  // sort in descending order
  allParagraphsStandalone.sort(
    (a, b) => b.correlationScore - a.correlationScore
  );
  fs.writeFileSync(
    `tmp/correlated-paragraphs/${impacted}-${recommendation}.json`,
    JSON.stringify(
      getTopScoringParagraphs(allParagraphsStandalone, 'correlationScore')
    )
  );
  console.info(`Done finding correlation of ${recommendation} for ${impacted}`);
}
