export interface EbiParserOptions {
  parsedArticleHead: ParsedArticleHead;
}

export interface HealthRemedies {
  impacted: string;
  recommendations: string[];
}

export interface ParsedArticleHead {
  id: string;
  title: string;
  xmlFullTextDownloadLink: string;
}

export interface ParsedArticle {
  head: ParsedArticleHead;
  paragraphs: ParsedArticleParagraph[];
}

export interface ParsedArticleParagraph {
  body: string;
  correlationScore: number;
}

export interface Parser<IRet> {
  parserF: (inputSource: string, opts?: any) => Promise<IRet[]>;
}
