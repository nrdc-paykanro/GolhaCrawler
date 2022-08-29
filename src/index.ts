import fs from "fs";
import path from "path";
import axios from "axios";
import puppeteer from "puppeteer";
import { load } from "cheerio";
//extract File address from pure html
async function getProgramFileAddress(baseAddress: string) {
  //baseAddress : https://backup.golha.co.uk/vod/
  const response = await axios.get(
    "https://backup.golha.co.uk/fa/programme/717#.YwxBtGVByM8"
  );
  const html = response.data;
  const indVOD = html.indexOf("vod");
  let str = html.slice(indVOD + 4, html.indexOf('"', indVOD));
  console.log(baseAddress + str);
  return baseAddress + str;
}

async function getProgramDetail() {
  let detaliInfoArray: string[];
  const browser = await puppeteer.launch({
    headless: true,
    timeout: 300000,
  });
  const page = await browser.newPage();
  try {
    await page.goto("https://backup.golha.co.uk/fa/programme/717#.YwxBtGVByM8");
    const audioSrc = await page.evaluate(
      'document.querySelector("#jp_audio_0").getAttribute("src")'
    );
    console.log(audioSrc);

    // const b = await page.evaluate('document.querySelector(".item_div")');
    await page.waitForSelector(".item_div");
    let detailElementTags = await page.$$(".item_div");
    for (let element of detailElementTags) {
      let data = await page.evaluate((e) => e.innerHTML, element);
      const $ = load(data);
      let a = $("*").each((i,element) => {
        console.log(element);
        //element.attribs.onclick
      });
      console.log(data);

      // detaliInfoArray.push(await page.evaluate((e) => e.textContent, element));
    }

    await browser.close();
  } catch (err) {
    console.log(err);
  }
}

async function main() {
  getProgramDetail();
}

main();
