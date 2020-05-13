const express = require('express');
const router = express.Router();

const orderControllers = require('./../controllers/orders');

router.get('/', orderControllers.getAllOrders)

router.post('/', orderControllers.addNewOrder)

router.get('/:orderId', orderControllers.getOrderInfo)

router.patch('/:orderId', orderControllers.updateOrder)

router.delete('/:orderId', orderControllers.deleteOrder)

module.exports = router;
