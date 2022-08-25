import fs from 'fs';
import path from 'path';
import axios from 'axios';
import cheerio from 'cheerio';

async function main() {
	const response = await axios.get("https://backup.golha.co.uk/fa/programme/18#.Ywb1pX3P3IV");
		const html = response.data;

		const $ = cheerio.load(html);

		const links = $('#jp_audio_0').get();
		console.log(links);
}

main();