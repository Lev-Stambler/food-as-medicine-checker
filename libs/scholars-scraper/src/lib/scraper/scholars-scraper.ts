import {
  ParsedArticleHead,
  ScholarsParserOpts,
} from '@foodmedicine/interfaces';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Scraper } from '@foodmedicine/scraper';
import * as parsers from '../parsers';
import { getSynonyms } from '@foodmedicine/word-explorer';

/**
 * Construct the google scholars url which will be scraped
 * @param pageSize - the number of articles to get
 */
function createScholarsUrl(
  impacted: string,
  solution: string,
  pageSize: number,
  synonym = true
): string {
  return encodeURI(
    `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${solution} ${impacted}&synonym=${synonym}&pageSize=${pageSize}`
  );
}

/**
 * Find all the PDF urls which could have related articles to the remedy
 * @param remedy - one particular impacted and a set of recommendations
 * @returns an array of PDF urls
 */
export async function runScholarsScraper(
  impacted: string,
  recommendation: string,
  pageSize = 25
): Promise<ParsedArticleHead[]> {
  const queryUrl = createScholarsUrl(impacted, recommendation, pageSize);
  const remedyScraper = new Scraper<ParsedArticleHead>(parsers.ScholarsParser, {
    url: queryUrl,
    tag: {
      recommendation: recommendation,
      impacted: impacted,
    },
    impactedSynonyms: await getSynonyms(impacted),
  } as ScholarsParserOpts);

  const articleHeads = await remedyScraper.run();
  return articleHeads;
}
