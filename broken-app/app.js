import { router } from "./appRouter.js";

import express from "express";

export const app = express();

app.use("/", router);
