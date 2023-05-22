require("dotenv").config();
const express = require("express");
const { connection } = require("./db");
const { userRoute } = require("./router/user.router");
const { productRoute } = require("./router/product.router");

const app = express();
app.use(express.json());

app.use("/user", userRoute);
app.use("/product", productRoute);

app.listen(3300, async () => {
  await connection;
  console.log("server started on port 3300");
});
