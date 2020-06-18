import {
  ParsedArticleParagraphStandalone,
  ParsedArticle,
  ArticleParagraphBacksUpClaim,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';
import * as scholarsScraper from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';

export async function getQueryResult(
  query: string
): Promise<ParsedArticleParagraphStandalone[]> {
  return await findCorrelatedParagraphs(query);
}

/**
 * Get the top percentage of an array
 * @param arr - an array sorted in descending order
 * @param percent - percentage of items to be returned
 */
function getTopPercentage<T>(arr: T[], percent = 5): T[] {
  return arr.slice(0, Math.floor((arr.length * percent) / 100));
}

async function findCorrelatedParagraphs(
  query: string,
  numberOfArticles = 25,
  scoreCutOff = 10
): Promise<ParsedArticleParagraphStandalone[]> {
  const articleHeads = await scholarsScraper.runScholarsScraper(
    query,
    '',
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
  return getTopPercentage(
    allParagraphsStandalone,
    'correlationScore',
    scoreCutOff
  );
}
