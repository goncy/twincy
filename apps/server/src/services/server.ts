import * as http from "http";

import cors from "cors";
import express from "express";

import { initWSServer } from "./socket";

import router from "~/routes";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(
  cors({
    origin: "http://localhost:6601",
  }),
);
app.use("/api", router);

const server = new http.Server(app);
initWSServer(server);
export default server;
