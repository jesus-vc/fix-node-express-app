import { readFile, writeFile, appendFile } from "node:fs/promises";
import fetch from "node-fetch";
import pLimit from "p-limit";

const MAX_CONCURRENT_REQUESTS = 10; // Set your desired concurrency limit
const writeFileErrors = [];
const httpErrors = [];

async function fetchData() {
  try {
    const urls = await readUrlsFromFile();
    const concurrencyLimit = pLimit(MAX_CONCURRENT_REQUESTS);

    const processUrl = async (url) => {
      try {
        const response = await fetch(url);
        const responseBody = await response.text();
        const cleanedUrl = url.replace(/^https?:\/\//, "").replace(/\//g, "\u2215");
        await saveFulfilled(responseBody, cleanedUrl);
      } catch (error) {
        await saveRejected(error, url);
      }
    };

    // Process URLs concurrently without waiting for all promises to settle
    await Promise.all(urls.map((url) => concurrencyLimit(() => processUrl(url)));

    writeFileErrors.forEach((error) => appendFile("./results/writeFileErrors.txt", `${error}\n`));
    httpErrors.forEach((error) => appendFile("./results/httpErrors.txt", `${error}\n`));

    console.log(
      `All HTTP requests were completed. The /results directory contains a unique file for each successful request and there may be error files if errors were encountered.\n`
    );
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function saveFulfilled(responseBody, url) {
  try {
    await writeFile(`./results/${url}.txt`, responseBody);
  } catch (error) {
    writeFileErrors.push(`Error saving successful response for ${url}: ${error.message}`);
  }
}

async function saveRejected(error, url) {
  httpErrors.push(`Error fetching ${url}: ${error.message}`);
}

fetchData();
