import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as fs from 'fs';
import {
  ParsedArticleParagraph,
  ParsedArticleParagraphStandalone,
} from '@foodmedicine/interfaces';

function getTopPercentage(arr: any[], percent = 5) {
  return arr.slice(0, Math.floor(arr.length * percent / 100));
}

async function run() {
  const mockRemedey = {
    impacted: 'brain improving',
    recommendations: ['ginger'],
  };
  const articleHeads = await scholarsScrape.runScholarsScraper(
    mockRemedey.impacted,
    mockRemedey.recommendations[0]
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
    `tmp/${mockRemedey.impacted}-${mockRemedey.recommendations}.json`,
    JSON.stringify(getTopPercentage(allParagraphsStandalone))
  );
}
run();
