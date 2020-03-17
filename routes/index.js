
const auth = require("./api/auth");

module.exports = app => {
  app.use("/auth", auth);

  // Test API
  app.use("/",(req, res) => {
    res.send("API ok!");
  });
};
