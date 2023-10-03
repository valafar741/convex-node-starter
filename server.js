import http from "http";
import url from "url";

import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
import { api } from "./convex/_generated/api.js";
dotenv.config({ path: ".env.local" });

const hostname = "0.0.0.0";
const port = 3000;

const httpClient = new ConvexHttpClient(process.env["CONVEX_URL"]);

http
  .createServer(async (req, res) => {
    const { path } = url.parse(req.url, true);
    console.log(path);

    const messages = await httpClient.query(api.messages.list);
    const body = messages.map((m) => `${m.author}: ${m.body}`).join("\n");

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Messages\n" + body);
  })
  .listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
