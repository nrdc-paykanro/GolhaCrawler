import fs from "fs";
import path from "path";
import axios from "axios";
import puppeteer from "puppeteer";
import { load } from "cheerio";

interface audioDetailInfo{
  fromTo:string[],
  title:string,
  timeLineLocation:string,
  detail:[{
    title:string,
    name:string
  }]
}
interface programInformationDetail {
  programGolhaLink:string,
  programTitle:string,
  programFileAddress:string,
  programArtists:string[],
  audioDetailInfo:audioDetailInfo[],
}
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
    let golhaLinkAddress:string = "https://backup.golha.co.uk/fa/programme/717#.YwxBtGVByM8";
    await page.goto(golhaLinkAddress);
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
      let a = $("*").each((i, element) => {
        let elName: any = (element as any).name;
        let elDuration: string[] = [];
        let elInformation : string[] = [];
        if (elName === "a" || elName === "em") {
          let elValue = (element as any).children[0].data;
          (element as any).attribs.onclick &&
            (elDuration = extractDurition((element as any).attribs.onclick));
          if (elValue !== null && elValue !== undefined) 
            elInformation.push((element as any).children[0].data)
            console.log((element as any).children[0].data);
        }
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

function extractDurition(stringFunction: string){
  stringFunction = stringFunction.replace('cue(','');
  stringFunction = stringFunction.replace(');','');
  stringFunction = stringFunction.replace('\'','');
  stringFunction = stringFunction.replace('\'','');
  stringFunction = stringFunction.replace(' ','');

  return stringFunction.split(',');
}

async function main() {
  getProgramDetail();
}

main();
