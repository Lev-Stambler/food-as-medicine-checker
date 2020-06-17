import {
  Parser,
  ParsedArticleHead,
  ScholarsParserOpts,
} from '@foodmedicine/interfaces';
import * as xmlJs from 'xml2js';
import * as wordnet from 'wordnet';
import * as util from 'util';
import * as natural from 'natural';

const wordnetLookup = util.promisify(wordnet.lookup);

// TODO put synonyms in their own lib package named wordMeaning
// TODO add glossary def to word meaning
async function getSynonyms(word: string): Promise<string[]> {
  // n is for the nouns
  const synonymWordsArrProms: Promise<string[][]>[] = word.split(' ').map(
    async (individualWord): Promise<string[][]> => {
      try {
        return (
          await wordnetLookup(natural.PorterStemmer.stem(individualWord))
        ).map((def) => def.meta.words.map((item) => item.word));
      } catch (e) {
        console.error(
          'Error finding synonyms for %s. Error %s',
          individualWord,
          e
        );
        return [[]];
      }
    }
  );
  const synonymWordsArr: string[][][] = await Promise.all(synonymWordsArrProms);
  // make sure the items in the array are all truthy
  const synonymWords = synonymWordsArr
    .flat(Infinity)
    .filter((synonym) => synonym && !word.includes(synonym));
  if (!synonymWords) {
    return [];
  }
  console.info('Found synonym words for %s:', word, synonymWords);
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
    const impactedSynonyms = await getSynonyms(opts.tag.impacted);
    const recommendationSynonyms = await getSynonyms(opts.tag.recommendation);
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
