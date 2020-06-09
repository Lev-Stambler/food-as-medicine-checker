export interface IHealthRemedies {
  symptom: string;
  solutions: string[];
}

export interface IParser<IRet> {
  parserF: (inputSource: string) => Promise<IRet[]>;
}
