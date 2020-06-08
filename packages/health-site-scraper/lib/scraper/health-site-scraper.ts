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
 * Finds associated health remedies for a particular website
 * @param url
 * @param parser the necessary parser for a specific URL
 */
export async function scrapeHealthSite(
  url: string,
  parser: IParser
): Promise<IHealthRemedies[]> {
  const html = await getSiteSourceHTML(url);
  return await parser.parserF(html);
}

export async function runAllScrapers() {
  await scrapeHealthSite(
    "https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/",
    parsers.ElainemoranWellnessParser
  );
}
