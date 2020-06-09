import { IParser, IHealthRemedies, Scraper } from "@foodmedicine/interfaces";
import * as parsers from "../parsers";

/**
 * Construct the google scholars url which will be scraped
 * @param symptom
 * @param solution
 * @param start the starting article number
 */
function createScholarsUrl(
  symptom: string,
  solution: string,
  start = 0
): string {
  return encodeURI(
    `https://scholar.google.com/scholar?q=${solution} for ${symptom} "pdf"&start=${start}`
  );
}

/**
 * Find all the PDF urls which could have related articles to the remedey
 * @param remedey one particular symptom and a set of solutions
 * @returns an array of PDF urls
 */
export async function runScholarsScraper(
  remedey: IHealthRemedies
): Promise<string[]> {
  const queryUrls = remedey.solutions.map((solution) =>
    createScholarsUrl(remedey.symptom, solution)
  );
  const remedeyScraper = new Scraper<string>(
    parsers.GoogleScholarsParser,
    ...queryUrls
  );
  
  // the following urls may have repeats
  const urls = await remedeyScraper.run();

  console.log(urls)
  return urls
}
