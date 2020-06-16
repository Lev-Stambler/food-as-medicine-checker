import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
  ImpactFileList,
} from '@foodmedicine/interfaces';

const allParagraphsBasePath = './tmp/correlated-paragraphs/';

function getAllJsonPaths(): string[] {
  const path = allParagraphsBasePath + impactListFileName;
  const impactList: ImpactFileList = JSON.parse(
    fs.readFileSync(path).toString()
  ) as ImpactFileList;
  // get all the filenames from each impact item
  return impactList
    .map((impactItem) => impactItem.recommendations.map((rec) => rec.fileName))
    .flat();
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

function createNewPath(originalFileName: string): string {
  return `${__dirname}/../../../apps/table-frontend/src/app/rated-paragraphs/${originalFileName}`;
}

function copyAllJsonPaths() {
  const path = allParagraphsBasePath + impactListFileName;
  fs.copyFileSync(path, createNewPath(impactListFileName));
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
  copyAllJsonPaths();
  console.log('Done with parsing out related paragraphs');
}
