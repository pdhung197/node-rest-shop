const express = require('express');
const router = express.Router();

const productControllers = require('./../controllers/products');

const upload = require('./../controllers/uploader');

router.get('/', productControllers.getAllProducts)

router.post('/', upload.single('image'), productControllers.addNewProduct)

router.get('/:productId', productControllers.getProductInfo)

router.patch('/:productId', upload.single('image'), productControllers.updateProduct)

router.delete('/:productId', productControllers.deleteProduct)

module.exports = router;
