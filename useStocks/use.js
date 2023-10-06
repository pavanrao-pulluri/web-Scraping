const axios = require("axios");
const cheerio = require("cheerio");
const { parse } = require("json2csv");
const { writeFileSync } = require("fs");

const url = "https://www.use.or.ug/content/corporate-announcements";
const baseUrl = "https://www.use.or.ug";
const results = [];

const usecode = async () => {
  const res = await axios(url);
  const $ = cheerio.load(res.data);

  const dataelem = $("tbody>tr");
  for (const element of dataelem) {
    const titleElement = $(element).find("a");
    const announcement = titleElement.text().trim();
    const sizeElement = $(element).find("td:nth-child(2)");
    const size = sizeElement.text();
    const dateElement = $(element).find("td:nth-child(3)");
    const date = dateElement.text().slice(0, 10);
    const timeElement = $(element).find("td:nth-child(3)");
    const time = timeElement.text().slice(11, 19);

    const pdfbase = $(element).find("a").attr("href");

    const pdfBase1 = baseUrl + pdfbase;

    const pdf = encodeURI(pdfBase1);

    results.push({ announcement, size, date, time, pdf });
  }
  const csv = parse(results);
  // console.log(csv);
  writeFileSync("./useStocks/announcements.csv", csv);
};
usecode();
