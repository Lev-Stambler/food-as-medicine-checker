import { Parser, ParsedArticle } from '@foodmedicine/interfaces';
import * as xmlJs from 'xml2js';

/**
 * A parser for https://scholar.google.com/scholar?q={my query here}
 */
export const GoogleScholarsParser: Parser<ParsedArticle> = {
  parserF: async (xml) => {
    const parser = new xmlJs.Parser(/* options */);
    const jsonRes = await parser.parseStringPromise(xml);
    console.log(jsonRes.responseWrapper.resultList[0].result.map(result => result.id))//.map(result => result.id))
    // const $ = cheerio.load(html);
    // console.log(html);
    // const resultWrappers = $('.gs_r.gs_or.gs_scl');
    // // ensure that only links to PDFs are found
    // const resultWrappersOnlyPDFs = resultWrappers.filter((i, el) => {
    //   console.log('AA');
    //   console.log($(el).children('div.gs_fl').text());
    //   return $(el).children('div.gs_fl').text().indexOf('[PDF]') !== -1;
    // });

    // // get the urls through the anchor tags
    // const urls = resultWrappersOnlyPDFs.map((wrapper) =>
    //   $(wrapper).children('h3.gs_rt a').attr('href')
    // );

    // console.log(resultWrappers.length, urls.toArray(), urls.length);
    return [];
  },
};
