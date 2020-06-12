import * as fs from 'fs';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
  ImpactFileList,
} from '@foodmedicine/interfaces';

const allParagraphsBasePath = './tmp/correlated-paragraphs/';
function getAllJsonPaths(): string[] {
  const path = allParagraphsBasePath + 'impact-recommendation-list.json';
  const impactList: ImpactFileList = JSON.parse(
    fs.readFileSync(path).toString()
  ) as ImpactFileList;
  // get all the filenames from each impact item
  return impactList
    .map((impactItem) => impactItem.recommendations.map((rec) => rec.fileName))
    .flat();
}

function getParagraphsFromFile(
  filename: string
): Promise<ParsedArticleParagraphStandalone[]> {
  return new Promise((res, rej) => {
    fs.readFile(`${allParagraphsBasePath}/${filename}`, (err, data) => {
      if (err) {
        rej(err);
      }
      const json = JSON.parse(data.toString());
      res(json as ParsedArticleParagraphStandalone[]);
    });
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
  console.log(paragraphFilenames);
  const storeRatedParagraphsPerArticleProms = paragraphFilenames.map(
    async (paragraphFilename) => {
      const paragraphs = await getParagraphsFromFile(paragraphFilename);
      const ratedParagraphs = paragraphs.filter(paragraphIsRated);
      saveParagraphs(createNewPath(paragraphFilename), ratedParagraphs);
    }
  );
  await Promise.all(storeRatedParagraphsPerArticleProms);
  console.log('Done with parsing out related paragraphs');
}
