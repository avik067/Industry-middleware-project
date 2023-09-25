const { Router } = require('express');
var express = require('express');
var router = express.Router();
const Seller = require('../../Controllers/Auth/Seller');


const middleware = require('../../service/middleware').middleware;

const sellerRoute = require('./seller');

router.post('/seller/register', Seller.register);
router.post('/seller/login', Seller.login);

router.use(middleware);
router.use('/seller', sellerRoute)

module.exports = router;
