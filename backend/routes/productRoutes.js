import { Router } from 'express';
import {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, uploadProductImage,
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../validators/authValidator.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, adminOnly, validate(createProductSchema), createProduct);
router.put('/:id', protect, adminOnly, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);
router.post('/:id/upload-image', protect, adminOnly, upload.single('image'), uploadProductImage);

export default router;
