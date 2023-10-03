const axios = require("axios");
const cheerio = require("cheerio");
const { parse } = require("json2csv");

const url = "https://www.use.or.ug/content/corporate-announcements";
const baseUrl = "https://www.use.or.ug";
const results = [];

const ugscode = async () => {
  const res = await axios(url);
  // console.log(response.data);
  const $ = cheerio.load(res.data);

  const dataelem = $("tbody>tr");
  // console.log(dataelem);
  for (const element of dataelem) {
    // console.log(element);
    // const ele = $(element).text();
    // console.log(ele);

    const titleElement = $(element).find("a");
    const announcement = titleElement.text().trim();
    // console.log(announcement);

    const sizeElement = $(element).find("td:nth-child(2)");
    const size = sizeElement.text();
    // console.log(size);

    const dateElement = $(element).find("td:nth-child(3)");
    const date = dateElement.text().slice(0, 10);
    // console.log(date);

    const timeElement = $(element).find("td:nth-child(3)");
    const time = timeElement.text().slice(11, 19);
    // console.log(time);

    const pdfbase = $(element).find("a").attr("href");
    // const encodedpdf = pdfbase.replace(/\s/g, "%20");
    // console.log(encodedRelativePdfLink);
    const pdfBase1 = baseUrl + pdfbase;

    const pdf = encodeURI(pdfBase1);

    // const replacedString = pdfLinkwithspaces.replace(/%2F/, "/");
    // console.log(replacedString);

    results.push({ announcement, size, date, time, pdf });
  }
  const csv = parse(results);
  console.log(csv);
  // writeFileSync("announcements3.csv", csv);
};
module.exports = ugscode;