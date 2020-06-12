import {
  ParsedArticleHead,
  Parser,
  ParsedArticle,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';
import * as fetch from 'node-fetch';
import { correlationWeights, cutOffs } from './correlation-constants';
import * as natural from 'natural';

const tokenizer = new natural.WordTokenizer();

async function downloadArticle(url: string): Promise<string> {
  const ret = await fetch(url);
  return await ret.text();
}

/**
 * Find word frequencies through fuzzy search
 * @param word
 * @param paragraph
 */
function findWordFreqFuzzy(word: string, paragraph: string): number {
  const tokenizedParagraph = tokenizer.tokenize(paragraph);
  const overallFreqScore = tokenizedParagraph.reduce(
    (freq: number, paragraphWord) => {
      // distance ranges from 0 to 1. 1 being a perfect match
      const distance = natural.JaroWinklerDistance(word, paragraphWord);
      return freq + (distance > cutOffs.minimumWordDistance ? distance : 0);
    },
    0
  );
  return overallFreqScore;
}

/**
 * Compute the correlation score based off of the inputs
 * Current features include impact frequencies, recommendation frequencies, impact x recommendation
 * Paragraph length
 * @param impactFreq
 * @param recommendationFreq
 * @param paragraphWordCount
 */
function computeScore(
  impactFreq: number,
  recommendationFreq: number,
  paragraphWordCount: number
): number {
  const impactScore = impactFreq * correlationWeights.impactWordFreq;
  const recommendationScore =
    recommendationFreq * correlationWeights.recommendationWordFreq;
  const crossScore =
    impactFreq *
    recommendationFreq *
    correlationWeights.impactCrossRecommendation;
  const paragraphLengthScore =
    paragraphWordCount * correlationWeights.paragraphLength;
  // ensures that both impact and recommendation are seen in the same paragraph
  return impactScore + recommendationScore + crossScore + paragraphLengthScore;
}

function stemString(input: string) {
  return natural.PorterStemmer.tokenizeAndStem(input).join(' ');
}

async function getParagraphCorrelationScore(
  paragraph: string,
  impacted: string,
  recommendation: string
): Promise<ParsedArticleParagraph> {
  const impactedStem = stemString(impacted);
  const paragraphStemmed = stemString(paragraph);
  const recommendationStem = stemString(recommendation);
  const correlationScore = computeScore(
    findWordFreqFuzzy(impactedStem, paragraphStemmed),
    findWordFreqFuzzy(recommendationStem, paragraphStemmed),
    paragraph.split(' ').length
  );
  return {
    body: paragraph,
    correlationScore,
  };
}

export async function evaluateArticle(
  articleHead: ParsedArticleHead,
  parser: Parser<ParsedArticle>
): Promise<ParsedArticle> {
  const inputXML = await downloadArticle(articleHead.xmlFullTextDownloadLink);
  // Parser functions return an array, but in this case, only the first result is relevant
  return (await parser.parserF(inputXML, {
    parsedArticleHead: articleHead,
    impacted: articleHead.impacted,
    recommendation: articleHead.recommendation,
    getCorrelationScore: getParagraphCorrelationScore,
  })) as ParsedArticle;
}
