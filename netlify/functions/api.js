const serverless = require("serverless-http");
const app = require("../../app");
const handler = serverless(app);

exports.handler = async (event, context) => {
  await app.connectToDatabase();
  return handler(event, context);
};
