import {
  ParsedArticleParagraphStandalone,
  ParsedArticle,
  ParsedArticleParagraph,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';
import * as scholarsScraper from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';

export async function findQueryResults(
  query: string
): Promise<ParsedArticleParagraphStandalone[]> {
  const articleHeads = await scholarsScraper.runScholarsScraper(query, '', 5);
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
  return allParagraphsStandalone;
}
