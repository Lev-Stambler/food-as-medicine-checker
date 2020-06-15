import {
  ParsedArticle,
  Parser,
  ParsedArticleParagraph,
  EbiParserOptions,
} from '@foodmedicine/interfaces';
import * as cheerio from 'cheerio';

/**
 * A parser for https://www.ebi.ac.uk/europepmc/webservices/rest/
 */
export const EbiParser: Parser<ParsedArticle> = {
  parserF: async (xml: string, opts?: EbiParserOptions) => {
    if (!opts?.parsedArticleHead || !opts?.impacted || !opts?.recommendation) {
      throw 'Please add in the parsed head, impacted, and recommendation through the options';
    }
    const $ = cheerio.load(xml);
    const paragraphTexts: string[] = $('p')
      .map((i, el) => $(el).text())
      .get();
    const paragraphsProms: Promise<
      ParsedArticleParagraph
    >[] = paragraphTexts.map((paragraphText) =>
      opts.getCorrelationScore(
        paragraphText,
        opts.impacted,
        opts.recommendation
      )
    );
    const paragraphs = await Promise.all(paragraphsProms);
    const article: ParsedArticle = {
      head: opts.parsedArticleHead,
      paragraphs,
    };
    return article;
  },
};

export const x = 'a';
