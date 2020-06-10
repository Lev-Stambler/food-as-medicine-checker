import { getParagraphs } from './correlation-score';
import { EbiParser } from '../parser';

describe('scrapes and parse an article from Ebi to find a correlation score', () => {
  it('should return 25 article heads for each recomendation', async () => {
    const paragraphs = await getParagraphs(
      {
        id: 'asas',
        title: 'asa',
        xmlFullTextDownloadLink: 'asas',
      },
      EbiParser
    );
  });
});
