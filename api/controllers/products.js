const mongoose = require('mongoose');

const Product = require('../models/product');

const getAllProducts = (req, res, next) => {
    Product.find()
        .select('_id product description image price')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error
            })
        })
};

const addNewProduct = (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.product,
        price: req.body.price,
        description: req.body.description,
    })
    if (req.file) product.image = req.file.path;
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'POST request to Products',
                result
            })
        })
        .catch(error => {
            res.status(500).json({
                error
            })
        });

};

const getProductInfo = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (doc) res.status(200).json({ doc });
            else res.status(404).json({
                message: 'No entry found'
            })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error
            })
        });

};

const updateProduct = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const opsKey in req.body) {
        updateOps[opsKey] = req.body[opsKey]
    }
    if (req.file) updateOps.image = req.file.path;
    Product.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error))
};

const deleteProduct = (req, res, next) => {
    Product.remove({
        _id: req.params.productId
    })
        .exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => {
            res.status(500).json(error)
        })
};

module.exports = {
    getAllProducts,
    getProductInfo,
    addNewProduct,
    updateProduct,
    deleteProduct
};
