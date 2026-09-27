import express from "express";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  createProductValidator,
  productIdValidator,
  updateProductValidator,
} from "../validators/product.validator.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", authenticate, createProductValidator, createProduct);
router.get("/", getAllProducts);
router.get("/:id", productIdValidator, getProductById);
router.put("/:id", authenticate, updateProductValidator, updateProduct);
router.delete("/:id", authenticate, productIdValidator, deleteProduct);

export default router;
