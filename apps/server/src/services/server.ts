import * as http from "http";

import express from "express";

import { initWSServer } from "./socket";

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

const server = new http.Server(app);
initWSServer(server);
export default server;
