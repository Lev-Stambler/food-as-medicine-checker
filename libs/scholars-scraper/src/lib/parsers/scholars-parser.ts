import { Parser, ParsedArticleHead } from '@foodmedicine/interfaces';
import * as xmlJs from 'xml2js';

/**
 * A parser for https://www.ebi.ac.uk/europepmc/webservices/rest/
 */
export const ScholarsParser: Parser<ParsedArticleHead> = {
  parserF: async (xml) => {
    const parser = new xmlJs.Parser(/* options */);
    const jsonRes = await parser.parseStringPromise(xml);
    const allResults = jsonRes.responseWrapper.resultList[0].result;
    const parsedHeads: ParsedArticleHead[] = allResults.map((res) => {
      return {
        id: res.id[0],
        title: res.title[0],
        xmlFullTextDownloadLink: `https://www.ebi.ac.uk/europepmc/webservices/rest/${res.id[0]}/fullTextXML`,
      };
    });
    return parsedHeads;
  },
};
