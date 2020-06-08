import { IParser, IHealthRemedies } from "interfaces";
import * as cheerio from "cheerio";

/**
 * A parser for https://elainemoranwellness.com/food-as-medicine-database/search-by-health-condition
 */
export const ElainemoranWellnessParser: IParser = {
  parserF: async (html) => {
    const $ = cheerio.load(html);
    const symptom = $("h1.entry-title").text().toLowerCase();
    // remove parantheses which are used as side notes
    const foodItems = $("div.thrv_wrapper ul li")
      .map((i, el) =>
        $(el)
          .text()
          .replace(/\(.*\)/g, "")
          .replace("&", "and")
          .toLowerCase()
      )
      .get();
    let res: IHealthRemedies[] = [
      {
        symptom,
        solutions: foodItems,
      },
    ];
    return res;
  },
};
