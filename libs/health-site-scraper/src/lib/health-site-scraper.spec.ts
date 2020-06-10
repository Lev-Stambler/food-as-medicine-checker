import { healthSiteScraper } from './health-site-scraper';

describe('healthSiteScraper', () => {
  it('should work', () => {
    expect(healthSiteScraper()).toEqual('health-site-scraper');
  });
});
