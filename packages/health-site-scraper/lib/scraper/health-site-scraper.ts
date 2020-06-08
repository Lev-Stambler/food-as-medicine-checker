import { IParser, IHealthRemedies, Scraper } from "@food-medicine/interfaces";
import * as parsers from "../parsers";

export async function runAllScrapers() {
  const remediesScraper = new Scraper<IHealthRemedies>(
    parsers.ElainemoranWellnessParser,
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/muscle-building/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/energy-increasing/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/blood-sugar-balancing/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/brain-improving/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/"
  );
  const remedies = remediesScraper.run();
  console.log(remedies);
}
