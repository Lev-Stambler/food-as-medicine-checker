export interface IHealthRemedies {
  symptom: string;
  solution: string;
}

export interface IParser {
  parserF: (inputHTML: string) => Promise<IHealthRemedies[]>;
}
