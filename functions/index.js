const functions = require("firebase-functions");
const fs = require("fs");

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const denyAccess = (res) => {
  res.statusCode = 401;
  res.setHeader("WWW-Authenticate", 'Basic realm="Authorization Required');
  res.end("Unauthorized");
};

exports.basicAuth = functions.https.onRequest((req, res) => {
  const html = fs.readFileSync("index.html").toString();

  if (!USERNAME || !PASSWORD) {
    res.send(html);
    return;
  }

  if (typeof req.headers.authorization !== "string") {
    denyAccess(res);
    return;
  }

  const base64Auth = req.headers.authorization.split(" ")[1];
  if (typeof base64Auth !== "string") {
    denyAccess(res);
    return;
  }

  const [user, pass] = Buffer.from(base64Auth, "base64").toString().split(":");
  if (user !== USERNAME || pass !== PASSWORD) {
    denyAccess(res);
    return;
  }

  res.send(html);
});
