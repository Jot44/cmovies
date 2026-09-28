const express = require("express");
const titleRoutes = require("./modules/titles/title.routes.js");
const errorHandler = require("./shared/errors/errorHandler.js");

const app = express();

app.use(express.json());
app.use("/cmovies", titleRoutes);
app.use(errorHandler);

module.exports = app;
