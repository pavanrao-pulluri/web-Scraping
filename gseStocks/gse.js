const axios = require("axios");
const cheerio = require("cheerio");
const { parse } = require("json2csv");
const { writeFileSync } = require("fs");

const url = "https://gse.com.gh/press-releases/";

const results = [];

async function gsecode() {
  const res = await axios(url);
  const $ = cheerio.load(res.data);
  const dataele = $(".nectar-post-grid-item");
  for (const ele of dataele) {
    const name = $(ele).find("span.meta-category>a");
    const company_name = name.text().trim();

    const date_ele = $(ele).find("span.meta-date");
    const date = date_ele.text();

    const head_ele = $(ele).find(".post-heading>a:nth-child(1)");
    const pressnote = head_ele.text();

    const pdfbase = $(ele).find("a.nectar-post-grid-link").attr("href");
    results.push({ company_name, date, pressnote, pdfbase });
    await innnerurl(results);

    console.log(results);
  }
}

async function innnerurl(results) {
  for (const ele of results) {
    const res = await axios(ele.pdfbase);
    const $ = cheerio.load(res.data);
    const pdflink = $("div.content-inner")
      .find("figure>p>a:nth-child(1)")
      .attr("href");
    console.log(pdflink);
    // ele.pdflink = pdflink;
    // results.push({ pdflink });
  }
}
gsecode();
