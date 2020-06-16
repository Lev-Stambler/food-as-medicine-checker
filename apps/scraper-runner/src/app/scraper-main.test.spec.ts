import * as main from './scraper-main';

describe("Scrape Elaine Moran's site and find correlating scholarly paragraphs", () => {
  it("should return paragraphs which are correlated to the first 3 claims on Elaine Moran's site", async () => {
    await main.main({ limit: 1, numberOfArticles: 5 });
  }, 1000000);
});
