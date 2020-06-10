import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as healthSiteScraper from '@foodmedicine/health-site-scraper';
import * as fs from 'fs';
import {
  ParsedArticleParagraph,
  ParsedArticleParagraphStandalone,
} from '@foodmedicine/interfaces';

function getTopPercentage(arr: any[], percent = 5) {
  return arr.slice(0, Math.floor((arr.length * percent) / 100));
}

async function main() {
  const healthRemedies = await healthSiteScraper.runAllScrapers();
  const findCorrelatedParagraphsProms = healthRemedies.map(
    async (healthRemedey) => {
      const recommendationResults = healthRemedey.recommendations.map(
        (recommendation) =>
          findCorrelatedParagraphs(healthRemedey.impacted, recommendation)
      );
      return await Promise.all(recommendationResults);
    }
  );
  await Promise.all(findCorrelatedParagraphsProms);
}

async function findCorrelatedParagraphs(
  impacted: string,
  recommendation: string
) {
  console.log(
    `Starting to find correlation of ${recommendation} for ${impacted}`
  );
  const articleHeads = await scholarsScrape.runScholarsScraper(
    impacted,
    recommendation
  );
  const downloadProms = articleHeads.map(async (articleHead) => {
    const evaluatedArticle = await articleParser.evaluateArticle(
      articleHead,
      articleParser.EbiParser
    );
    return evaluatedArticle;
  });
  const allEvaluatedArticles = await Promise.all(downloadProms);
  const standaloneParagraphsGrouped = allEvaluatedArticles.map((article) =>
    article.paragraphs.map((paragraph) => {
      return {
        head: article.head,
        ...paragraph,
      };
    })
  );
  const allParagraphsStandalone: ParsedArticleParagraphStandalone[] = standaloneParagraphsGrouped.flat();
  // sort in descending order
  allParagraphsStandalone.sort(
    (a, b) => b.correlationScore - a.correlationScore
  );
  fs.writeFileSync(
    `tmp/${impacted}-${recommendation}.json`,
    JSON.stringify(getTopPercentage(allParagraphsStandalone))
  );
  console.log(
    `Done finding correlation of ${recommendation} for ${impacted}`
  );
}
main();
