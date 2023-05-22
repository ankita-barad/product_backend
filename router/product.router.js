const express = require("express");
const { ProductModel } = require("../model/product.model");
const productRoute = express.Router();
const { checkRole } = require("../middleware/authorization");
const { auth } = require("../middleware/auth");

productRoute.post(
  "/addProducts",
  auth,
  checkRole(["seller"]),
  async (req, res) => {
    try {
      const { name, price } = req.body;

      const newProduct = new ProductModel({ name, price });
      newProduct.save();
      res.status(200).send("Product added");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

productRoute.get("/", auth, checkRole(["buyer"]), async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

productRoute.delete(
  "/delete/:id",
  auth,
  checkRole(["seller"]),
  async (req, res) => {
    try {
      await ProductModel.findByIdAndDelete(req.params.id);
      res.status(200).send("Product deleted");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);

module.exports = { productRoute };
