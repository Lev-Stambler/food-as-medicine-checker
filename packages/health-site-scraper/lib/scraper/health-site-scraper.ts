import { IParser, IHealthRemedies } from "interfaces";
import * as parsers from "../parsers";

/**
 * Retrieves the HTML source code of a url
 * @param url
 */
async function getSiteSource(url: string): Promise<string> {
  return "";
}

/**
 * Finds associated health remedies for a particular website
 * @param url
 * @param parser the necessary parser for a specific URL
 */
export async function scrapeHealthSite(
  url: string,
  parser: IParser
): Promise<IHealthRemedies[]> {
  console.log('aa')
  return await parser.parserF("asas");
}

export async function runAllScrapers() {
  await scrapeHealthSite(
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/",
    parsers.ElainemoranWellnessParser
  );
}
