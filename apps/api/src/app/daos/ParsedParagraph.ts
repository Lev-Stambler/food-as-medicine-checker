import {
  ParsedArticleParagraphStandalone,
  ParsedArticle,
  ArticleParagraphBacksUpClaim,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';
import * as scholarsScraper from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import logger from '../shared/Logger';
import { getTopScoringParagraphs } from '../shared/functions';
export async function getQueryResult(
  query: string
): Promise<ParsedArticleParagraphStandalone[]> {
  return await findCorrelatedParagraphs(query);
}

async function findCorrelatedParagraphs(
  query: string,
  numberOfArticles = 25,
  scoreCutOff = 10
): Promise<ParsedArticleParagraphStandalone[]> {
  logger.info(`Starting to find correlated paragraphs for ${query}`);
  const articleHeads = await scholarsScraper.runScholarsScraper(
    query,
    '',
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
  return getTopScoringParagraphs(
    allParagraphsStandalone,
    'correlationScore',
    scoreCutOff
  );
}
