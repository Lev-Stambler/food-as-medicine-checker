import {
  ParsedArticleHead,
  Parser,
  ParsedArticle,
  HealthRemedies,
  ParsedArticleParagraph,
} from '@foodmedicine/interfaces';
import * as fetch from 'node-fetch';
import { parse } from 'querystring';
import { correlationWeights } from './correlation-constants';

async function downloadArticle(url: string): Promise<string> {
  const ret = await fetch(url);
  return await ret.text();
}

function findWordFreq(word: string, paragraph: string): number {
  console.log(paragraph)
  return paragraph.split(word).length - 1;
}

async function computeScore(
  impactFreq: number,
  recommendationFreq: number
): Promise<number> {
  return (
    impactFreq * correlationWeights.impactWordFreq +
    recommendationFreq * correlationWeights.recommendationWordFreq
  );
}

async function getParagraphCorrelationScore(
  paragraph: string,
  impacted: string,
  recommendation: string
): Promise<ParsedArticleParagraph> {
  const correlationScore = await computeScore(
    findWordFreq(impacted, paragraph),
    findWordFreq(recommendation, paragraph)
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
