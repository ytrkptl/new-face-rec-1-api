const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const routes = require("./routes");

if (process.env.NODE_ENV !== "production") require("dotenv").config();

const app = express();

app.use(morgan("combined"));
app.use(cors("*"));
app.use(express.json());

app.use(routes)

app.listen(process.env.PORT, () =>
  console.log(`app is running on port ${process.env.PORT}`)
);
