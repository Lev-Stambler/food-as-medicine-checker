import { HealthRemedies, ParsedArticleHead } from '@foodmedicine/interfaces';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Scraper } from '@foodmedicine/scraper';
import * as parsers from '../parsers';

/**
 * Construct the google scholars url which will be scraped
 * @param impacted
 * @param solution
 * @param pageSize the number of articles to get
 */
function createScholarsUrl(
  impacted: string,
  solution: string,
  pageSize = 25
): string {
  return encodeURI(
    // TOOD change synonym back to true once synonym is implemented in the correlation algorithm
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${solution} for ${impacted}&synonym=false&pageSize=${pageSize}`
  );
}

/**
 * Find all the PDF urls which could have related articles to the remedey
 * @param remedey one particular impacted and a set of recommendations
 * @returns an array of PDF urls
 */
export async function runScholarsScraper(
  impacted: string,
  recommendation: string
): Promise<ParsedArticleHead[]> {
  const queryUrls = [createScholarsUrl(impacted, recommendation)];
  const remedeyScraper = new Scraper<ParsedArticleHead>(
    parsers.ScholarsParser,
    ...queryUrls.map((url) => {
      return {
        url,
        tag: {
          recommendation: recommendation,
          impacted: impacted,
        },
      };
    })
  );

  // the following urls may have repeats
  const articleHeads = await remedeyScraper.run();
  return articleHeads;
}
