import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';

const allParagraphsBasePath = './tmp/correlated-paragraphs/';

function getAllJsonPaths(): string[] {
  return fs.readdirSync(allParagraphsBasePath);
}

async function getParagraphsFromFile(
  filename: string,
  cb: (parsed: ParsedArticleParagraphStandalone[]) => void
) {
  fs.readFile(`${allParagraphsBasePath}/${filename}`, (err, data) => {
    const json = JSON.parse(data.toString());
    cb(json as ParsedArticleParagraphStandalone[]);
  });
}

function paragraphIsRated(
  paragraph: ParsedArticleParagraphStandalone
): boolean {
  return paragraph.backsUpClaim !== ArticleParagraphBacksUpClaim.notApplicable;
}

function saveParagraphs(
  path: string,
  paragraphs: ParsedArticleParagraphStandalone[]
) {
  fs.writeFileSync(path, JSON.stringify(paragraphs));
}

// TODO the return value will be changed with the implementation of the frontend
function createNewPath(originalFileName: string): string {
  return `${__dirname}/../../../tmp/rated-paragraphs/${originalFileName}`;
}

export async function storeRatedParagraphs() {
  const paragraphFilenames = getAllJsonPaths();
  const storeRatedParagraphsPerArticleProms = paragraphFilenames.map(
    async (paragraphFilename) => {
      getParagraphsFromFile(paragraphFilename, (paragraphs) => {
        const ratedParagraphs = paragraphs.filter(paragraphIsRated);
        saveParagraphs(createNewPath(paragraphFilename), ratedParagraphs);
      });
    }
  );
  await Promise.all(storeRatedParagraphsPerArticleProms);
  console.info('Done with parsing out related paragraphs');
}
