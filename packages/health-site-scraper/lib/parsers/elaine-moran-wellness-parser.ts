import { IParser, IHealthRemedies } from "interfaces";
import * as cheerio from 'cheerio'

/**
 * A parser for https://elainemoranwellness.com/food-as-medicine-database/search-by-health-condition
 */
export const ElainemoranWellnessParser: IParser = {
  parserF: async (html) => {
    const $ = cheerio(html);
    $('')
    let res: IHealthRemedies[] = []
    return res
  },
};
