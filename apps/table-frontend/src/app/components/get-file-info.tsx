import { ParsedArticleParagraphStandalone } from '@foodmedicine/interfaces';

export function getFile(fileName: string) {
  return require(`../rated-paragraphs/${fileName}`) as ParsedArticleParagraphStandalone[];
}
