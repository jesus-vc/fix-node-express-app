const axios = require("axios");
const fs = require("fs").promises;

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    return { status: "fulfilled", value: response.data };
  } catch (error) {
    return { status: "rejected", reason: error.message };
  }
}

async function saveResponseToFile(response) {
  try {
    const dataToWrite =
      response.status === "fulfilled"
        ? `Fulfilled: ${JSON.stringify(response.value)}`
        : `Rejected: ${response.reason}`;

    await fs.writeFile(`response_${Date.now()}.txt`, dataToWrite);
    console.log(`Response saved to file: response_${Date.now()}.txt`);
  } catch (error) {
    console.error("Error saving response to file:", error);
  }
}

async function fetchAndSaveData() {
  const urls = ["url1", "url2", "url3"];

  //TODO why the need to create a new array via map?
  //Here, I understand that the "await fetchData(url)" returns control to the event loop.
  //Would the next operation be to run the next iteration in urls.map?

  const promises = urls.map(async (url) => {
    const response = await fetchData(url);
    // Save response to file as soon as it arrives
    await saveResponseToFile(response);
    //TODO why are we still returning a rsponse?
    return response;
  });

  // Wait for all promises to complete if necessary (optional)
  await Promise.all(promises);
}

fetchAndSaveData();
