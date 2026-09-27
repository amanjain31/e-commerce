import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const userId = req.user.userId;

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      category,
      createdBy: userId,
    });

    res.status(201).json({
      message: `product created successfully`,
      data: {
        product,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    res.status(200).json({
      message: `Products fetched successfully`,
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product fetched successfully",
      data: { product },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        message: `Product not found`,
      });
    }

    const { name, description, price, stock, category } = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        stock,
        category,
      },
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: `Product updated successfully`,
      data: { product: updatedProduct },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productModel.findById(id);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
