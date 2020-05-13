const mongoose = require('mongoose');

const Order = require('./../models/order');
const Product = require('./../models/product');

const getAllOrders = (req, res, next) => {
    Order.find()
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                orders: docs.map(doc => ({
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3440/orders/' + doc.id
                    }
                }))
            }
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({
                error
            })
        })
};

const addNewOrder = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) throw {
                message: 'Product not found',
                errorCode: 401
            };

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: product._id
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json(result)
        })
        .catch(error => {
            res.status(error.errorCode || 500).json(error)
        })
};

const getOrderInfo = (req, res, next) => {
    const id = req.params.orderId;
    Order.findById(id)
        .populate('product', '-__v')
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

const updateOrder = (req, res, next) => {
    const id = req.params.orderId;
    const updateOps = {};
    for (const opsKey in req.body) {
        updateOps[opsKey] = req.body[opsKey]
    }

    Order.update({ _id: id }, {
        $set: updateOps
    })
        .exec()
        .then(result => res.status(200).json(result))
        .catch(error => res.status(500).json(error))
};

const deleteOrder = (req, res, next) => {
    Order.remove({
        _id: req.params.orderId
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
    getAllOrders,
    addNewOrder,
    getOrderInfo,
    updateOrder,
    deleteOrder
};
