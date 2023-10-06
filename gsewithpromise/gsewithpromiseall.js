const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const url = "https://gse.com.gh/press-releases/";

const gsewithprom = async () => {
  const res = await axios(url);
  const $ = cheerio.load(res.data);
  const dataElements = $(".nectar-post-grid-item");
  const results = [];

  for (const element of dataElements) {
    const name = $(element).find("span.meta-category > a");
    const company_name = name.text().trim();

    const date_ele = $(element).find("span.meta-date");
    const date = date_ele.text();

    const head_ele = $(element).find(".post-heading > a:nth-child(1)");
    const pressnote = head_ele.text();

    const pdfbase = $(element).find("a.nectar-post-grid-link").attr("href");

    results.push({ company_name, date, pressnote, pdfbase });
  }

  const updatedResults = await Promise.all(
    results.map(async (result) => {
      const res = await axios(result.pdfbase);
      const $ = cheerio.load(res.data);
      const pdflink = $("div.content-inner")
        .find("figure>p>a:nth-child(1)")
        .attr("href");
      result.pdflink = pdflink;
      return result;
    })
  );

  for (const result of updatedResults) {
    if (result) {
      const fileName = `${result.company_name}_${result.date}.pdf`;
      const pdfFilePath = path.join(
        "./gsewithpromise/pdfs-downloaded",
        fileName
      );

      const pdfDirectory = path.dirname(pdfFilePath);
      if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory, { recursive: true });
      }

      const pdfResponse = await axios.get(result.pdflink, {
        responseType: "stream",
      });
      const pdfStream = pdfResponse.data;
      const writeStream = fs.createWriteStream(pdfFilePath);
      pdfStream.pipe(writeStream);

      console.log(`Downloaded: ${fileName}`);
    }
  }
};
gsewithprom();
