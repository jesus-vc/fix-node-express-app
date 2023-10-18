import { readFile, writeFile } from "node:fs/promises";
// import {resolve} from 'node:path';

import fetch from "node-fetch";

async function readUrlsFromFile() {
  try {
    // PEER promise-based readFile method to asyncronously get URL, send Axios requests, and save responses.
    // I would've used the non-promise based readFile in a scenario where there is a short list of URLs,
    // and it would be okay to block the event loop until all URLs are read.
    const urls = await readFile(process.argv[2], "utf8");
    return urls.trim().split("\n");
  } catch (err) {
    console.error(err.message);
  }
}

async function getData(url) {
  // use try-catch to catch any HTTP errors
  try {
    const response = await fetch(url);
    return response.text();
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  try {
    /* PEER I decided to pair await-async with readUrlsFromFile()
        which will block proceeding statements until resolved.
        However one question is what are techniques for handling scaling.
        For example: If there are 10,000 files to read, 
        we probably wouldn't want readUrlsFromFile() to block the event loop from
        sending HTTP requests and processing responses until all 10,000 files are read.
        
        So what are asynchronous techniques to read URLs, send requests, and process responses?
    
        Alongside, if the URLs are being fetched from a remote server,
        what technique would allow me to process a stream of URLs as they arrive?
        How would queues and/or streams play a role here? 
        */
    const urls = await readUrlsFromFile();

    let count = 1;
    // const promiseArray = [];

    // for (const url of urls) {
    //   const response = await getData(url);
    //   await writeFile(`${count++}.txt`, response);
    // }

    urls.forEach(async (url) => {
      //PEER we need to await getData(url), otherwise 'response' will be an unresolved Promise object.

      const response = await getData(url);
      writeFile(`${count++}.txt`, response);
    });
  } catch (error) {
    console.error(error.message);
  }
}

main();

//PEER is 'await' needed in       await writeFile(`${count++}.txt`, response);?
