import { Parser } from "@foodmedicine/interfaces";
import * as cheerio from "cheerio";

/**
 * A parser for https://scholar.google.com/scholar?q={my query here}
 */
export const GoogleScholarsParser: Parser<string> = {
  parserF: async (html) => {
    const $ = cheerio.load(html);
    const resultWrappers = $(".gs_r.gs_or.gs_scl");
    // ensure that only links to PDFs are found
    const resultWrappersOnlyPDFs = resultWrappers.filter((i, el) => $(el).children("div.gs_fl").text().indexOf("[PDF]") !== -1);

    // get the urls through the anchor tags
    const urls = resultWrappersOnlyPDFs.map((wrapper) =>
      $(wrapper).children("h3.gs_rt a").attr("href")
    )

    console.log(resultWrappers.length, urls.toArray(), urls.length)
return []
  },
};
