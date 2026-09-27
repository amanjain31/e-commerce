import { body, param, validationResult } from "express-validator";

export const createProductValidator = [
  body("name")
    .exists()
    .withMessage(`Name is required`)
    .bail()
    .isString()
    .withMessage(`Name must be a string`)
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(`Name length must be between 2 to 100 characters`),

  body("description")
    .exists()
    .withMessage(`Description is required`)
    .bail()
    .isString()
    .withMessage(`Description must be a string`)
    .trim()
    .isLength({ min: 5 })
    .withMessage(`Description must be at least 5 characters long`),

  body("price")
    .exists()
    .withMessage(`Price is required`)
    .bail()
    .isFloat({ min: 0 })
    .withMessage(`Price must be a positive number`),

  body("stock")
    .exists()
    .withMessage(`Stock is required`)
    .bail()
    .isInt({ min: 0 })
    .withMessage(`Stock must be a positive integer`),

  body("category")
    .optional()
    .isString()
    .withMessage(`Category must be a string`)
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: `Invalid request`,
        errors: errors.array(),
      });
    }

    next();
  },
];

export const updateProductValidator = [
  param("id").isMongoId().withMessage(`Invalid product id`),

  body("name")
    .optional()
    .isString()
    .withMessage(`Name must be a string`)
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage(`Name length must be between 2 to 100 characters`),

  body("description")
    .optional()
    .isString()
    .withMessage(`Description must be a string`)
    .trim()
    .isLength({ min: 5 })
    .withMessage(`Description must be at least 5 characters long`),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage(`Price must be a positive number`),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage(`Stock must be a positive integer`),

  body("category")
    .optional()
    .isString()
    .withMessage(`Category must be a string`)
    .trim(),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: `Invalid request`,
        errors: errors.array(),
      });
    }

    next();
  },
];

export const productIdValidator = [
  param("id").isMongoId().withMessage(`Invalid product id`),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: `Invalid request`,
        errors: errors.array(),
      });
    }

    next();
  },
];
