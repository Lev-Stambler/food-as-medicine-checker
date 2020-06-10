import {
  ParsedArticleHead,
  Parser,
  ParsedArticle,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';
import * as fetch from 'node-fetch';
import { correlationWeights } from './correlation-constants';
import * as natural from 'natural';

async function downloadArticle(url: string): Promise<string> {
  const ret = await fetch(url);
  return await ret.text();
}

function findWordFreq(word: string, paragraph: string): number {
  return paragraph.split(word).length - 1;
}

/**
 * Compute the correlation score based off of the inputs
 * Current features include impact frequencies, recommendation frequencies, impact x recommendation
 * Paragraph length
 * @param impactFreq
 * @param recommendationFreq
 */
async function computeScore(
  impactFreq: number,
  recommendationFreq: number,
  paragraphWordCount: number
): Promise<number> {
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
  return input
    .split(' ')
    .map((word) => natural.PorterStemmer.stem(word))
    .join(' ');
}

async function getParagraphCorrelationScore(
  paragraph: string,
  impacted: string,
  recommendation: string
): Promise<ParsedArticleParagraph> {
  const impactedStem = stemString(impacted);
  const paragraphStemmed = stemString(paragraph);
  const recommendationStem = stemString(recommendation);
  const correlationScore = await computeScore(
    findWordFreq(impactedStem, paragraphStemmed),
    findWordFreq(recommendationStem, paragraphStemmed),
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
  return (
    await parser.parserF(inputXML, {
      parsedArticleHead: articleHead,
      impacted: articleHead.impacted,
      recommendation: articleHead.recommendation,
      getCorrelationScore: getParagraphCorrelationScore,
    })
  )[0];
}
