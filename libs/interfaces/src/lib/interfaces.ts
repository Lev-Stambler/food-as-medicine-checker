export enum ArticleParagraphBacksUpClaim {
  yes = 'y',
  no = 'n',
  notApplicable = 'na',
}

type getCorrelationScoreFunction = (
  paragraph: string,
  impacted: string,
  recommendation: string
) => Promise<ParsedArticleParagraph>;

export interface BaseParserOptions {
  tag?: string;
}

interface ArticleParserOptions extends BaseParserOptions {
  impacted: string;
  recommendation: string;
  getCorrelationScore: getCorrelationScoreFunction;
}

export interface EbiParserOptions extends ArticleParserOptions {
  parsedArticleHead: ParsedArticleHead;
}

export interface HealthRemedies {
  impacted: string;
  recommendations: string[];
}

/**
 * Contains the outline information of an article
 */
export interface ParsedArticleHead {
  id: string;
  title: string;
  xmlFullTextDownloadLink: string;
  impacted: string;
  recommendation: string;
}

export interface ParsedArticle {
  head: ParsedArticleHead;
  paragraphs: ParsedArticleParagraph[];
}

export interface ParsedArticleParagraph {
  body: string;
  correlationScore: number;
}

export interface ParsedArticleParagraphStandalone
  extends ParsedArticleParagraph {
  head: ParsedArticleHead;
  backsUpClaim: ArticleParagraphBacksUpClaim;
}

export interface Parser<IRet> {
  parserF: (inputSource: string, opts?: any) => Promise<IRet[]>;
}

export interface ScholarsParserOpts {
  tag: {
    recommendation: string;
    impacted: string;
  };
}

export interface UrlWithTag {
  url: string;
  tag?: any;
}
