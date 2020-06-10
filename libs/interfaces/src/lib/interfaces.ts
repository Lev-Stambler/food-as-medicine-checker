export interface HealthRemedies {
  impacted: string;
  recommendations: string[];
}

export interface ParsedArticle {
  id: string;
  title: string;
  downloadLink: string;
}

export interface Parser<IRet> {
  parserF: (inputSource: string) => Promise<IRet[]>;
}
