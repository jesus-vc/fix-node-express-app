import axios from "axios";
import { ExpressError } from "./appErrors.js";

export async function getData(array, urlPath) {
  //PEER Why wasn't this function working before adding Promise.allSettled?
  const result = await Promise.allSettled(
    array.map(async (developer) => {
      const response = await axios.get(`${urlPath}${developer}`);
      return response;
    })
  );
  return result;
}

export function calculateResults(array) {
  let fulfilled = 0;
  let results = array.map((response) => {
    if (response.status === "fulfilled") {
      fulfilled++;
      return { name: response.value.data.name, bio: response.value.data.bio };
    } else if (response.status === "rejected") {
      return {
        Error: `${response.reason.request.path} was not found.`,
      };
    }
  });
  if (fulfilled !== 0) {
    return JSON.stringify(results);
  } else {
    return new ExpressError("Github does not recognize any of your users", 418);
  }
}
