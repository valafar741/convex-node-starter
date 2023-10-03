import { api } from "./convex/_generated/api.js";
import { Doc } from "./convex/_generated/dataModel.js";
import readline from "readline";
import { client } from "./client.js";

let allMessages: Doc<"messages">[] = [];
let input: string = "";
let time: string = "time goes here";
let lastKey: string = "";

// Use the `ConvexClient` to subscribe to queries as well as run mutations
// and actions.
const unsubscribe = client.onUpdate(api.messages.list, {}, (messages) => {
  console.log("got messages update!", messages);
  allMessages = messages;
  render();
});

// Call this on query update, keypress, or timer event
function render() {
  process.stdout.write("\x1b[2J"); // clear the screen
  process.stdout.write("\x1b[H"); // cursor to top left corner
  for (const message of allMessages) {
    console.log(`\x1b[2m${message.author} says\x1b[22m`, message.body);
  }
  console.log(
    `Last key pressed was '${lastKey}' - decimal ${lastKey.charCodeAt(
      0
    )} - hex ${lastKey.charCodeAt(0).toString(16)}`
  );
  console.log(time);
  console.log("enter to send, ctrl-c to exit");
  process.stdout.write("\x1b[K"); // erase line
  process.stdout.write(input);
}

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true).on("keypress", async (key) => {
  if (key === undefined) return;
  lastKey = key;
  switch (key) {
    case "\x03": {
      // ctrl-c
      // It's not actually necessary to unsubscribe or close the WebSocket
      // connection when exiting the process, but it is important cleanup
      // when your program is going to keep running.
      unsubscribe();
      console.log("all done");
      await client.close();
      process.exit();
    }
    case "\x08": // ctrl-h or backspace
    case "\x7f": {
      input = input.slice(0, -1);
      break;
    }
    case "\x09": // ctrl-j or ctrl-m
    case "\x0d": {
      client.mutation(api.messages.send, {
        author: process.env.USER || "anonymous",
        body: input,
      });
      input = "";
      break;
    }
    default: {
      input = input + key;
    }
  }

  render();
});

setInterval(() => {
  time = new Date().toLocaleTimeString();
  render();
}, 1000);

function ctrl(c: string) {
  return c.charCodeAt(0) - 96;
}
