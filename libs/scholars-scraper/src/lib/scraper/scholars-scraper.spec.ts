import { runScholarsScraper } from './scholars-scraper';

describe('scrapes Ebi to find scholarly articles', () => {
  it('should return 25 article heads for each recomendation', async () => {
    const recommendations = ['cabbage', 'grapes'];
    const heads = await runScholarsScraper({
      impacted: 'acne',
      recommendations,
    });
    expect(heads).toHaveLength(recommendations.length * 25);
    expect(heads[0].id).toBeTruthy();
    expect(heads[0].title).toBeTruthy();
    expect(heads[0].xmlFullTextDownloadLink).toBeTruthy();
  });
});
