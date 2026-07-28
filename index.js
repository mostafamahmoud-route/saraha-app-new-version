import express from "express";
import bootStrap from "./src/app.controller.js";

const app = express();

bootStrap(express, app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port", port);
});
