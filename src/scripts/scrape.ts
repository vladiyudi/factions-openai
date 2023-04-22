import axios from 'axios';
import * as cheerio from 'cheerio';
import {encode} from 'gpt-3-encoder';

const BASE_URL = 'https://machiavellic.io/';

const getLinks = async () => {
    const html = await axios.get(`${BASE_URL}/the-story`);
    const $ = cheerio.load(html.data);
    console.log(html.data);
}

(async()=>{
    await getLinks();
})();