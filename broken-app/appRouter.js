import { calculateResults, getData } from "./helpers.js";
import { ExpressError } from "./appErrors.js";
import express from "express";

export const router = express.Router();

router.use("/", express.json());

router.post("/", async function (req, res, next) {
  try {
    const url = "https://api.github.com/users/";
    const responses = await getData(req.body.developers, url);
    const results = calculateResults(responses);
    if (results instanceof ExpressError) {
      throw results;
    } else {
      return res.send(results);
    }
  } catch (error) {
    next(error);
  }
});

router.use((req, res, next) => {
  const error = new ExpressError("Page Not Found", 404);
  next(error);
});

//PEER Would it be best to make create a middleware function for this error handler and then
// place it in a separate file (e.g. errorHanlder.js)?

router.use((error, req, res, next) => {
  // the default status is 500 Internal Server Error
  let status = error.status || 500;
  let message = error.message || "Internal Server Error";

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status },
  });
});
