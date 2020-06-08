import { IParser, IHealthRemedies } from "interfaces";
import * as parsers from "../parsers";
import fetch from "node-fetch";

/**
 * Retrieves the HTML source code of a url
 * @param url
 */
async function getSiteSourceHTML(url: string): Promise<string> {
  const ret = await fetch(url);
  return await ret.text();
}

/**
 * Finds associated health remedies found on one page on a particular website
 * @param parser
 * @param url
 */
async function scrapeHealthSiteSinglePage(
  parser: IParser,
  url: string
): Promise<IHealthRemedies[]> {
  const html = await getSiteSourceHTML(url);
  return await parser.parserF(html);
}

/**
 * Finds associated health remedies found on a particular website
 * @param urls
 * @param parser the necessary parser for a specific URL
 */
export async function scrapeHealthSite(
  parser: IParser,
  ...urls: string[]
): Promise<IHealthRemedies[]> {
  // create an array of promises to concurrently perform web scraping
  const pageScrapingProms = urls.map((url) =>
    scrapeHealthSiteSinglePage(parser, url)
  );
  const healthRemedies = await Promise.all(pageScrapingProms);

  // Because each individual page returns an array of health remedies
  // healthRemedies will be an array of arrays which should be flattened
  return healthRemedies.flat();
}

export async function runAllScrapers() {
  const remedies = await scrapeHealthSite(
    parsers.ElainemoranWellnessParser,
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/muscle-building/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/energy-increasing/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/blood-sugar-balancing/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/brain-improving/",
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/"
  );
  console.log(remedies);
}
