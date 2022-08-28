import fs from "fs";
import path from "path";
import axios from "axios";
import cheerio from "cheerio";
import puppeteer from "puppeteer"
//extract File address from pure html
function getProgramFileAddress(html: string, baseAddress: string) {
  const indVOD = html.indexOf("vod");
  let str = html.slice(indVOD + 4, html.indexOf('"', indVOD));
  return baseAddress + str;
}

function getProgramDetail(html: string) {
//   const $ = cheerio.load(html);
//   let itemList = $(".item_div");
//   console.log(itemList);
}

async function main() {
  const response = await axios.get(
    "https://backup.golha.co.uk/fa/programme/1547#.YwrxD0ZByM8"
  );
  const html = response.data;

  getProgramDetail(html);

  const puppeteer = require("puppeteer");

  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://backup.golha.co.uk/fa/programme/1547#.YwrxD0ZByM8");
    const text = await page.evaluate('document.querySelector("#jp_audio_0").getAttribute("src")');
    await browser.close();
  })();
  //get file address
  console.log(getProgramFileAddress(html, "https://backup.golha.co.uk/vod/"));
}

main();
