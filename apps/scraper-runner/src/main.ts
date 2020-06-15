import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as healthSiteScraper from '@foodmedicine/health-site-scraper';
import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ParsedArticle,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';

/**
 * Get the top percentage of an array
 * @param arr - an array sorted in descending order
 * @param percent - percentage of items to be returned
 */
function getTopPercentage<T>(arr: T[], percent = 5): T[] {
  return arr.slice(0, Math.floor((arr.length * percent) / 100));
}

async function main() {
  const healthRemedies = await healthSiteScraper.runAllScrapers();
  healthRemedies.forEach(
    async (healthRemedy) => {
      const recommendationResults = healthRemedy.recommendations.map(
        (recommendation) =>
          findCorrelatedParagraphs(healthRemedy.impacted, recommendation)
      );
      return await Promise.all(recommendationResults);
    }
  );
  // await Promise.all(findCorrelatedParagraphsProms);
}

async function findCorrelatedParagraphs(
  impacted: string,
  recommendation: string
) {
  console.warn(
    `Starting to find correlation of ${recommendation} for ${impacted}`
  );
  const articleHeads = await scholarsScrape.runScholarsScraper(
    impacted,
    recommendation
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
    `tmp/${impacted}-${recommendation}.json`,
    JSON.stringify(getTopPercentage(allParagraphsStandalone))
  );
  console.warn(`Done finding correlation of ${recommendation} for ${impacted}`);
}
main();
