import { HealthRemedies } from '@foodmedicine/interfaces';
import { Scraper } from '@foodmedicine/scraper';
import * as parsers from '../parsers';

export async function runAllScrapers(): Promise<HealthRemedies[]> {
  const urls = [
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/brain-improving/',
  ];
  const remediesScraper = new Scraper<HealthRemedies>(
    parsers.ElainemoranWellnessParser,
    ...urls.map((url) => {
      return { url };
    })
  );
  const remedies = await remediesScraper.run();
  return remedies;
}
