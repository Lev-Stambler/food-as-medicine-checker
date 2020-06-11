export interface HealthRemedies {
  symptom: string;
  solutions: string[];
}

export interface Parser<IRet> {
  parserF: (inputSource: string) => Promise<IRet[]>;
}
