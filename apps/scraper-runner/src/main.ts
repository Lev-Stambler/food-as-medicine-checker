import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as fs from 'fs';

async function run() {
  const mockRemedey = {
    impacted: 'acne',
    recommendations: ['cabbage'],
  };
  const articleHeads = await scholarsScrape.runScholarsScraper(mockRemedey);
  console.log(articleHeads[0]);
  // const p = await articleParser.evaluateArticle(
  //   articleHeads[0],
  //   articleParser.EbiParser
  // );
  // console.log('Sorting now!');
  // console.log(
  //   p.paragraphs.sort((a, b) => a.correlationScore - b.correlationScore)
  // );
  const downloadProms = articleHeads.map(async (articleHead, i) => {
    const ret = await articleParser.evaluateArticle(
      articleHead,
      articleParser.EbiParser
    );
    fs.writeFileSync(`test-out/${i}.json`, JSON.stringify(ret))
    return ret;
  });
  const res = await Promise.all(downloadProms);
}
run();
