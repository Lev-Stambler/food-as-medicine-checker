import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as fs from 'fs';
import {
  ParsedArticleParagraph,
  ParsedArticleParagraphStandalone,
} from '@foodmedicine/interfaces';

async function run() {
  const mockRemedey = {
    impacted: 'brain improving',
    recommendations: ['ginger'],
  };
  const articleHeads = await scholarsScrape.runScholarsScraper(mockRemedey);
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
  console.log(allParagraphsStandalone.slice(0, 5))
}
run();
