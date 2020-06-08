import { IParser } from "./interfaces";
import fetch from "node-fetch";

export class Scraper<IRet> {
  private urls: string[];
  private parser: IParser<IRet>;
  constructor(parser: IParser<IRet>, ...urls: string[]) {
    this.urls = urls;
  }

  /**
   * Finds associated health remedies found on one page on a particular website
   * @param parser
   * @param url
   */
  async scrapeSiteSinglePage(url: string): Promise<IRet[]> {
    const html = await this.getSiteSourceHTML(url);
    return await this.parser.parserF(html);
  }

  /**
   * Retrieves the HTML source code of a url
   * @param url
   */
  async getSiteSourceHTML(url: string): Promise<string> {
    const ret = await fetch(url);
    return await ret.text();
  }

  /**
   * Finds associated health remedies found on a particular website
   * @param urls
   * @param parser the necessary parser for a specific URL
   */
  public async run(): Promise<IRet[]> {
    // create an array of promises to concurrently perform web scraping
    const pageScrapingProms = this.urls.map((url) =>
      this.scrapeSiteSinglePage(url)
    );
    const scrapedRes = await Promise.all(pageScrapingProms);

    // Because each individual page returns an array of results,
    // results will be an array of arrays which should be flattened
    return scrapedRes.flat();
  }
}
