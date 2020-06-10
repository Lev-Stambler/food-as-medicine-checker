import { HealthRemedies, } from "@foodmedicine/interfaces";
import { Scraper } from "@foodmedicine/scraper"
import * as parsers from "../parsers";

/**
 * Construct the google scholars url which will be scraped
 * @param impacted
 * @param solution
 * @param start the starting article number
 */
function createScholarsUrl(
  impacted: string,
  solution: string,
  pageSize = 25
): string {
  return encodeURI(
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${solution} for ${impacted}&synonym=true&pageSize=25`
  );
}

/**
 * Find all the PDF urls which could have related articles to the remedey
 * @param remedey one particular impacted and a set of recommendations
 * @returns an array of PDF urls
 */
export async function runScholarsScraper(
  remedey: HealthRemedies
): Promise<string[]> {
  const queryUrls = remedey.recommendations.map((solution) =>
    createScholarsUrl(remedey.impacted, solution)
  );
  console.log(queryUrls)
  const remedeyScraper = new Scraper<string>(
    parsers.GoogleScholarsParser,
    ...queryUrls
  );
  
  // the following urls may have repeats
  const urls = await remedeyScraper.run();

  console.log(urls)
  return urls
}
