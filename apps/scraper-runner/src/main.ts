import * as scholarsScrape from '@foodmedicine/scholars-scraper';
import * as articleParser from '@foodmedicine/article-parser';
import * as healthSiteScraper from '@foodmedicine/health-site-scraper';
import * as fs from 'fs';
import {
  ArticleParagraphBacksUpClaim,
  HealthRemedies,
  ImpactFileList,
  ParsedArticle,
  ParsedArticleParagraph,
  ParsedArticleParagraphStandalone,
} from '@foodmedicine/interfaces';

/**
 * Get the top percentage of an array
 * @param arr - an array sorted in descending order
 * @param percent - percentage of items to be returned
 */
function getTopPercentage<T>(arr: T[], percent = 5): T[] {
  return arr.slice(0, Math.floor((arr.length * percent) / 100));
}

function createFilename(impacted: string, recommendation: string): string {
  return `${impacted}-${recommendation}.json`.replace(' ', '_').replace('/', '_and_');
}

function createImpactList(healthRemedies: HealthRemedies[]): ImpactFileList {
  for (let i = 0; i < healthRemedies.length; i++) {
    for (
      let recommendationInd = 0;
      recommendationInd < healthRemedies[i].recommendations.length;
      recommendationInd++
    ) {
      if (healthRemedies[i].recommendations[recommendationInd]) {
        const recommendation =
          healthRemedies[i].recommendations[recommendationInd].recommendation;
        healthRemedies[i].recommendations[
          recommendationInd
        ].filename = createFilename(
          healthRemedies[i].impacted,
          recommendation
        ).replace('/', '_');
      }
    }
  }
  return healthRemedies;
}

async function main() {
  const healthRemedies = await healthSiteScraper.runAllScrapers();

  healthRemedies.forEach(async (healthRemedy) => {
    const recommendationResults = healthRemedy.recommendations.map(
      (recommendationInfo) =>
        findCorrelatedParagraphs(
          healthRemedy.impacted,
          recommendationInfo.recommendation
        )
    );
    return await Promise.all(recommendationResults);
  });

  // create a streamlined list which points to the other files
  const impactedList: ImpactFileList = createImpactList(healthRemedies);
  fs.writeFileSync(
    `tmp/correlated-paragraphs/impact-recommendation-list.json`,
    JSON.stringify(impactedList)
  );
  console.log('Done scraping!');
}

async function findCorrelatedParagraphs(
  impacted: string,
  recommendation: string
) {
  console.warn(
    `Starting to find correlation of ${recommendation} for ${impacted}`
  );
  const articleHeads = await scholarsScrape.runScholarsScraper(
    impacted,
    recommendation
  );
  const downloadProms: Promise<ParsedArticle>[] = articleHeads.map(
    async (articleHead) => {
      const evaluatedArticle: ParsedArticle = await articleParser.evaluateArticle(
        articleHead,
        articleParser.EbiParser
      );
      return evaluatedArticle;
    }
  );
  const allEvaluatedArticles: ParsedArticle[] = await Promise.all(
    downloadProms
  );
  const allParagraphsStandalone: ParsedArticleParagraphStandalone[] = [];
  allEvaluatedArticles.forEach((article) => {
    const standaloneParagraphs: ParsedArticleParagraphStandalone[] = article.paragraphs.map(
      (paragraph: ParsedArticleParagraph) => {
        return {
          head: article.head,
          // set default backsUpClaim to notApplicable. This later gets changed manually in the JSON file
          backsUpClaim: ArticleParagraphBacksUpClaim.notApplicable,
          ...paragraph,
        };
      }
    );
    allParagraphsStandalone.push(...standaloneParagraphs);
  });
  // sort in descending order
  allParagraphsStandalone.sort(
    (a, b) => b.correlationScore - a.correlationScore
  );
  fs.writeFileSync(
    `tmp/correlated-paragraphs/${createFilename(impacted, recommendation)}`,
    JSON.stringify(getTopPercentage(allParagraphsStandalone))
  );
  console.warn(`Done finding correlation of ${recommendation} for ${impacted}`);
}
main();
