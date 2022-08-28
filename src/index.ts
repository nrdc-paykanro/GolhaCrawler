import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';

async function main() {
	const response = await axios.get("https://backup.golha.co.uk/fa/programme/18#.Ywb1pX3P3IV");
		const html = response.data;
		const indVOD = html.indexOf('vod');
		let str = html.slice(indVOD+4,html.indexOf('\"',indVOD));
		console.log(str);
		
		const $ = cheerio.load(html,{xmlMode:true});
	
		const title = $('h1').contents().first().text();
		const audioSrc = $('#jp_audio_0');
		
		console.log(title);
}

main();