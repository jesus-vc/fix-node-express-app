import { readFile, writeFile, appendFile } from "node:fs/promises";

import fetch from "node-fetch";
import pLimit from "p-limit";

//PEER question - Is it true that capitalizing a variable name is a convention often used for constants in JS to distinguish them from regular variables?
const MAX_CONCURRENT_REQUESTS = 10;
const RESULTS_DIRECTORY = "./results/";
const WRITE_FILE_ERRORS_PATH = `${RESULTS_DIRECTORY}writeFileErrors.txt`;
const HTTP_ERRORS_PATH = `${RESULTS_DIRECTORY}httpErrors.txt`;

async function readUrlsFromFile() {
  try {
    const urls = await readFile(process.argv[2], "utf8");
    return urls.trim().split("\n");
  } catch (error) {
    //throwing error here to halt execution since program can't proceed without URLs.
    console.log("There was an error in reading your file: " + error);
    throw error;
  }
}

async function storeSuccessfulResponse(responseBody, url) {
  try {
    await writeFile(`${RESULTS_DIRECTORY}${url}.txt`, responseBody);
    return { url, result: `Success: ${url}` };
  } catch (error) {
    //PEER question - Is it necessary to place 'await' before before appendFile(), given there is no subsequent operations?
    await appendFile(
      WRITE_FILE_ERRORS_PATH,
      `The ${url} URL produced error when saving a successful HTTP response to a file: ${error}\n`
    );
  }
}

async function storeErrorResponse(errorBody, url) {
  try {
    await appendFile(
      HTTP_ERRORS_PATH,
      `The ${url} URL produced HTTP error: ${errorBody}\n`
    );
    return { url, result: `Error: ${url}` };
  } catch (error) {
    await appendFile(
      WRITE_FILE_ERRORS_PATH,
      `The ${url} URL  produced error when saving a failed HTTP response to a file: ${error}\n`
    );
  }
}

// Asynchronously fetch data from an array of urls and handle fulfilled and rejectd promises accordingly.
async function fetchData() {
  try {
    const urls = await readUrlsFromFile();
    const concurrencyLimit = pLimit(MAX_CONCURRENT_REQUESTS);

    const processUrl = async (url) => {
      try {
        const response = await fetch(url);
        const responseBody = await response.text();
        const cleanedUrl = url
          .replace(/^https?:\/\//, "")
          .replace(/\//g, "\u2215");
        return storeSuccessfulResponse(responseBody, cleanedUrl);
      } catch (error) {
        return storeErrorResponse(error, url);
      }
    };

    // Await all promises to settle before displaying results on terminal.
    const settledPromises = await Promise.allSettled(
      urls.map((url) => concurrencyLimit(() => processUrl(url)))
    );

    let fulfilledPromises = 0;
    let rejectedPromises = 0;

    settledPromises.forEach((result) => {
      if (result.status === "fulfilled") {
        fulfilledPromises++;
        console.log(result.value.result);
      } else if (result.status === "rejected") {
        rejectedPromises++;
        console.error(result.reason.result);
      }
    });
    console.log(
      `All HTTP requests were completed. The /results directory contains a unique file for each successful request and there may be error files if errors were encountered.\n`
    );
  } catch (error) {
    console.error(error);
  }
}

fetchData();
