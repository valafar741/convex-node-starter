import { ConvexClient } from "convex/browser";
import * as dotenv from "dotenv";
import { api } from "./convex/_generated/api.js";
dotenv.config({ path: ".env.local" });

export const client = new ConvexClient(process.env["CONVEX_URL"]!);
export { api };
