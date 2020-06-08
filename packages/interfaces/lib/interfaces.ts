export interface IHealthRemedies {
  symptom: string;
  solutions: string[];
}

export interface IParser<IRet> {
  parserF: (inputHTML: string) => Promise<IRet[]>;
}
