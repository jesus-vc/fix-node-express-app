//TODO understand when is it okay to use a for-loop with an asynch function?
//Make decision and move on on below...

//TODO refactor to capture everything in 1 try-catch
//TODO refactor to save correct file name.
//TODO once forEach finishes, write appropriate console.log output.

import fs from "fs";
import fetch from "node-fetch";

let urlsArray = [];

const saveURLs = () => {
  try {
    const urls = fs.readFileSync(process.argv[2], "utf8");
    urlsArray = urls.trim().split("\n");
  } catch (err) {
    console.error(err);
  }
};

//PEER Should I use these instead:
//Use writeFile
//I do believe each iteration does not block the next iteration.
// Each iteration resolves and write to file upon a successful HTTP response.

//fetchData() fetches HTTP response from urls.
//When fetchData() is called by a forEach method, the fetches should be asynchronous.
const fetchData = async (url, count) => {
  try {
    const response = await fetch(url);
    const body = await response.text();
    console.log(body);
    fs.writeFileSync(`${count}.txt`, body);
  } catch (err) {
    console.error(err);
  }
};

const writeFiles = () => {
  urlsArray.forEach((url, index) => {
    fetchData(url, index + 1);
  });
};

saveURLs();

writeFiles();

//PEER Is it accurate that "await" returns control to the event loop? In this case, the function that called the async function?
