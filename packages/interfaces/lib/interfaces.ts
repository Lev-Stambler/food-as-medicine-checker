export interface IHealthRemedies {
  symptom: string;
  solutions: string[];
}

export interface IParser {
  parserF: (inputHTML: string) => Promise<IHealthRemedies[]>;
}
