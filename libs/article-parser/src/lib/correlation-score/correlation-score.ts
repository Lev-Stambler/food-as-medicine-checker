import {
  ParsedArticleHead,
  Parser,
  ParsedArticle,
} from '@foodmedicine/interfaces';
import * as fetch from 'node-fetch';
import { parse } from 'querystring';

async function downloadArticle(url: string): Promise<string> {
  const ret = await fetch(url);
  return await ret.text();
}

export async function getParagraphs(
  articleHead: ParsedArticleHead,
  parser: Parser<ParsedArticle>
): Promise<ParsedArticle> {
  const inputXML = await downloadArticle(articleHead.xmlFullTextDownloadLink);
  // Parser functions return an array, but in this case, only the first result is relevant
  return (await parser.parserF(inputXML))[0];
}
