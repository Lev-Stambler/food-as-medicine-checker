import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as healthSiteScraper from '@foodmedicine/health-site-scraper';
import * as fs from 'fs';
import {
  ArticleParagraphBacksUpClaim,
  HealthRemedies,
  ImpactFileList,
  ParsedArticle,
  ParsedArticleParagraph,
  ParsedArticleParagraphStandalone,
} from '@foodmedicine/interfaces';

/**
 * Get the top percentage of an array
 * @param arr - an array sorted in descending order
 * @param percent - percentage of items to be returned
 */
function getTopPercentage<T>(arr: T[], percent = 5): T[] {
  return arr.slice(0, Math.floor((arr.length * percent) / 100));
}

function createFilename(impacted: string, recommendation: string): string {
  return `${impacted}-${recommendation}.json`.replace(' ', '_').replace('/', '_and_');
}

function createImpactList(healthRemedies: HealthRemedies[]): ImpactFileList {
  for (let i = 0; i < healthRemedies.length; i++) {
    for (
      let recommendationInd = 0;
      recommendationInd < healthRemedies[i].recommendations.length;
      recommendationInd++
    ) {
      if (healthRemedies[i].recommendations[recommendationInd]) {
        const recommendation =
          healthRemedies[i].recommendations[recommendationInd].recommendation;
        healthRemedies[i].recommendations[
          recommendationInd
        ].filename = createFilename(
          healthRemedies[i].impacted,
          recommendation
        ).replace('/', '_');
      }
    }
  }
  return healthRemedies;
}

/**
 * Get the paragraphs which are either above the {@code scoreCutOff} and only have {@code maxParagraphs}
 * @param arr - an array sorted in descending order
 * @param scoreAccessor - the key to access the score
 * @param scoreCutOff - minimum score required
 */
function getTopScoringParagraphs<T>(
  arr: T[],
  scoreAccessor: string,
  scoreCutOff = 10,
  maxParagraphs = 8
): T[] {
  const byCutOff = arr.filter((item) => item[scoreAccessor] >= scoreCutOff);
  if (byCutOff.length > maxParagraphs) {
    return byCutOff.slice(0, maxParagraphs);
  }
  return byCutOff;
}

export async function main(opts?: {
  limit?: number;
  numberOfArticles?: number;
  scoreCutOff?: number;
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
        recommendation.recommendation,
        opts?.numberOfArticles || 25,
        opts.scoreCutOff
      )
    );
    return await Promise.all(recommendationResults);
  });
  await Promise.all(remediesProm);
   // Create a streamlined list which points to the other files
   const impactedList: ImpactFileList = createImpactList(healthRemedies);
   fs.writeFileSync(
     `tmp/correlated-paragraphs/impact-recommendation-list.json`,
     JSON.stringify(impactedList)
   );
  console.info('Done with all scraping');
}

async function findCorrelatedParagraphs(
  impacted: string,
  recommendation: string,
  numberOfArticles: number,
  scoreCutOff?: number
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
      getTopScoringParagraphs(allParagraphsStandalone, 'correlationScore', scoreCutOff)
    )
  );
  console.info(`Done finding correlation of ${recommendation} for ${impacted}`);
}
