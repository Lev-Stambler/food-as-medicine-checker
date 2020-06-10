export interface HealthRemedies {
  impacted: string;
  recommendations: string[];
}

export interface ParsedArticleHead {
  id: string;
  title: string;
  xmlFullTextDownloadLink: string;
}

export interface Parser<IRet> {
  parserF: (inputSource: string) => Promise<IRet[]>;
}
