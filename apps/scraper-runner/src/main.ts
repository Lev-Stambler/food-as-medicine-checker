import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';

async function run() {
  const mockRemedey = {
    impacted: 'acne',
    recommendations: ['cabbage'],
  };
  const articleHeads = await scholarsScrape.runScholarsScraper(mockRemedey);
  console.log(articleHeads[0]);
  const p = await articleParser.evaluateArticle(
    articleHeads[0],
    articleParser.EbiParser
  );
  console.log('Sorting now!');
  console.log(
    p.paragraphs.sort((a, b) => a.correlationScore - b.correlationScore)
  );
  // const downloadProms = articleHeads.map((articleHead) =>
  //   articleParser.evaluateArticle(articleHead, articleParser.EbiParser)
  // );
  // await Promise.all(downloadProms);
}
run();
