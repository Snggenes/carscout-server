const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT,"0.0.0.0", () => {
  console.log("Server is listening on port 4000");
});
