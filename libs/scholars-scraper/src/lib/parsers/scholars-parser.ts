import {
  Parser,
  ParsedArticleHead,
  ScholarsParserOpts,
} from '@foodmedicine/interfaces';
import * as xmlJs from 'xml2js';
import synonyms from 'synonyms';

function getSynonyms(word: string): string[] {
  // n is for the nouns
  const synonymWordsArr: string[][] = word
    .split(' ')
    .map((inidividualWord) => synonyms(inidividualWord, 'n'));
  // make sure the items in the array are all truthy
  const synonymWords = synonymWordsArr.flat().filter((word) => word);
  if (!synonymWords) {
    return [];
  }
  console.info('Found synonym words:', synonymWords);
  return synonymWords;
}

/**
 * A parser for https://www.ebi.ac.uk/europepmc/webservices/rest/
 */
export const ScholarsParser: Parser<ParsedArticleHead> = {
  parserF: async (xml, opts?: ScholarsParserOpts) => {
    if (!opts) {
      throw 'Options must be passed into this scraper';
    }
    const parser = new xmlJs.Parser();
    const jsonRes = await parser.parseStringPromise(xml);
    const allResults = jsonRes.responseWrapper.resultList[0].result;
    const impactedSynonyms = getSynonyms(opts.tag.impacted);
    const recommendationSynonyms = getSynonyms(opts.tag.recommendation);
    const parsedHeads: ParsedArticleHead[] = allResults.map((res) => {
      return {
        id: res.id[0],
        title: res.title[0],
        xmlFullTextDownloadLink: `https://www.ebi.ac.uk/europepmc/webservices/rest/${res.id[0]}/fullTextXML`,
        recommendation: opts.tag.recommendation,
        impacted: opts.tag.impacted,
        impactedSynonyms: impactedSynonyms,
        recommendationSynonyms: recommendationSynonyms,
      };
    });
    return parsedHeads;
  },
};
