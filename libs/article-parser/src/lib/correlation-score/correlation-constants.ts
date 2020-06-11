export const correlationWeights = {
  // impact cross recommendation is high to place an emphasis on
  // having both impact and recommendation within one paragraph
  impactCrossRecommendation: 8,
  impactSynonymWordFreq: 0.7,
  impactWordFreq: 1,
  // currently at 0 so that length is disregarded
  paragraphLength: 0,
  recommendationWordFreq: 1,
  recommendationSynonymWordFreq: 0.7,
};

export const cutOffs = {
  minimumWordDistance: 0.85,
};
