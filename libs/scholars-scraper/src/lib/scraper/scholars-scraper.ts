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
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${solution} for ${impacted}&synonym=true&pageSize=${pageSize}`
  );
}

/**
 * Find all the PDF urls which could have related articles to the remedey
 * @param remedey one particular impacted and a set of recommendations
 * @returns an array of PDF urls
 */
export async function runScholarsScraper(
  remedey: HealthRemedies
): Promise<ParsedArticleHead[]> {
  const queryUrls = remedey.recommendations.map((solution) =>
    createScholarsUrl(remedey.impacted, solution)
  );
  const remedeyScraper = new Scraper<ParsedArticleHead>(
    parsers.ScholarsParser,
    ...queryUrls.map((url) => {
      return {
        url,
        tag: {
          recommendation: remedey.recommendations[0],
          impacted: remedey.impacted,
        },
      };
    })
  );

  // the following urls may have repeats
  const articleHeads = await remedeyScraper.run();
  return articleHeads;
}
