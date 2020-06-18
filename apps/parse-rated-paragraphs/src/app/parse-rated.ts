import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
  ImpactFileList,
} from '@foodmedicine/interfaces';

const ALL_PARAGRAPHS_BASE_PATH = './tmp/correlated-paragraphs/';
const IMPACT_LIST_FILE_NAME = 'impact-recommendation-list.json'

function getAllJsonPaths(): string[] {
  const path = ALL_PARAGRAPHS_BASE_PATH + IMPACT_LIST_FILE_NAME;
  const impactList: ImpactFileList = JSON.parse(
    fs.readFileSync(path).toString()
  ) as ImpactFileList;
  // Get all the file names which the impact list references
  // For each impact item, there is an array of recommendations
  // For each recommendation, there is a file name
  return impactList
    .map((impactItem) => impactItem.recommendations.map((rec) => rec.filename))
    .flat();
}

async function getParagraphsFromFile(
  filename: string,
  cb: (parsed: ParsedArticleParagraphStandalone[]) => void
) {
  fs.readFile(`${ALL_PARAGRAPHS_BASE_PATH}/${filename}`, (err, data) => {
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
  const path = ALL_PARAGRAPHS_BASE_PATH + IMPACT_LIST_FILE_NAME;
  fs.copyFileSync(path, createNewPath(IMPACT_LIST_FILE_NAME));
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
