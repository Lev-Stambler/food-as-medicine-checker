export const correlationWeights = {
  impactWordFreq: 1,
  impactSynonymWordFreq: 0.7,
  recommendationWordFreq: 1,
  recommendationSynonymWordFreq: 0.7,
  // impact cross recommendation is high to place an emphasis on
  // having both impact and recommendation within one paragraph
  impactCrossRecommendation: 8,
  // currently at 0 so that length is disregarded
  paragraphLength: 0,
};

export const cutOffs = {
  minimumWordDistance: 0.85,
};
