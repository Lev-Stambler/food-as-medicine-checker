import { HealthRemedies } from '@foodmedicine/interfaces';
import { Scraper } from '@foodmedicine/scraper';
import * as parsers from '../parsers';

export async function runAllScrapers(): Promise<HealthRemedies[]> {
  const remediesScraper = new Scraper<HealthRemedies>(
    parsers.ElainemoranWellnessParser,
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/muscle-building/',
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/energy-increasing/',
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/blood-sugar-balancing/',
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/brain-improving/',
    'https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/'
  );
  const remedies = await remediesScraper.run();
  console.log(remedies)
  return remedies;
}
