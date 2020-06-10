import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';

async function run() {
  const articleHeads = await scholarsScrape.runScholarsScraper({
    impacted: 'acne',
    recommendations: ['cabbage'],
  });
  console.log(articleHeads)
  // const downloadProms = articleHeads.map((articleHead) =>
  //   articleParser.downloadAndParseArticles(articleHead)
  // );
  // await Promise.all(downloadProms);
}
run();
console.log('Hello World!');
