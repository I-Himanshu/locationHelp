const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 7071 });
console.log(wss)
const USERS = new Map();

wss.on("connection", (ws) => {
  const id = uuidv4();
  const metadata = { id };

  ws.on("message", (messageAsString) => {
    const message = JSON.parse(messageAsString);
    console.log( message);
    if (message.type === "connect" && message.role === "helper") {
      USERS.set(ws, {
        id: uuidv4(),
        type: "helper",
      });
      return;
    }
    if (message.type === "connect" && message.role === "user") {
      USERS.set(ws, {
        id: uuidv4(),
        type: "user",
      });
      return;
    }
    if (message.type === "needHelp") {
      console.log("needHelp");
      message.from = USERS.get(ws).id;
      USERS.forEach((user, client) => {
        if (user.type === "helper") {
          client.send(JSON.stringify(message));
        }
      });
    }
    if (message.type === "sendHelp") {
      USERS.forEach((user, client) => {
        if (user.type === "user") {
          client.send(JSON.stringify(message));
        }
      });
    }
  });
  ws.on("open", (i) => {
    console.log("open", i);
  });
});

wss.on("close", () => {
  clients.delete(ws);
});

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

console.log("wss up");
