import { Parser, UrlWithTag } from '@foodmedicine/interfaces';
import fetch from 'node-fetch';
import { parse } from 'querystring';

/**
 * A generalized scraper abstraction class
 * This class can scrape different sites of pdfs
 * @param IRet is the return interface for a scraped site or article
 */
export class Scraper<IRet> {
  private urlsWithTags: UrlWithTag[];
  private parser: Parser<IRet>;
  constructor(parser: Parser<IRet>, ...urlsWithTags: UrlWithTag[]) {
    this.parser = parser;
    this.urlsWithTags = urlsWithTags;
  }

  /**
   * Retrieves the source code of a url
   * @param url
   */
  async getSiteSource(url: string): Promise<string> {
    const ret = await fetch(url);
    return await ret.text();
  }

  /**
   * Finds associated health remedies found on one page on a particular website
   * @param url
   * @param opts 
   */
  async scrapeSiteSinglePage(url: string, opts: any): Promise<IRet[]> {
    const source = await this.getSiteSource(url);
    return await this.parser.parserF(source, opts);
  }

  /**
   * Finds associated health remedies found on a particular website
   * @param urls
   * @param parser the necessary parser for a specific URL
   */
  public async run(): Promise<IRet[]> {
    // create an array of promises to concurrently perform web scraping
    const pageScrapingProms = this.urlsWithTags.map((urlWithTag) =>
      this.scrapeSiteSinglePage(urlWithTag.url, {
        tag: urlWithTag.tag,
      })
    );
    const scrapedRes = await Promise.all(pageScrapingProms);

    // Because each individual page returns an array of results,
    // results will be an array of arrays which should be flattened
    return scrapedRes.flat();
  }
}
