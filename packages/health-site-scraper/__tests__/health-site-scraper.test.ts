import * as assert from "assert";
import { scrapeHealthSite } from "../lib/scraper/health-site-scraper";
import { ElainemoranWellnessParser } from "../lib/parsers/elaine-moran-wellness-parser";

describe("scraper", async () => {
  it("should find remedies for acne", async () => {
    const remedies = await scrapeHealthSite(
      `https://www.elainemoranwellness.com/food-as-medicine-database/search-by-health-condition/acne-clearing/`,
      ElainemoranWellnessParser
    );
    // assert(remedies)
  });
});
