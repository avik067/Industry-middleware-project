var express = require('express');
var router = express.Router();

const Category = require('../../Controllers/Seller/Category/category');
const SubCategory = require('../../Controllers/Seller/Subcategory/subCategory');
const Brand = require('../../Controllers/Seller/Brand/brand');

// categpory part

router.post('/category', Category.categoryCreate);
router.get('/category', Category.categoryGet);
router.put('/category/:catId', Category.categoryEdit);
router.delete('/category/:catId', Category.categoryDelete);

// Subcategory part

router.post('/sub-category', SubCategory.subcategoryCreate);
router.get('/sub-category', SubCategory.subcategoryGet);
router.put('/sub-category/:subcatId', SubCategory.subcategoryEdit);
router.delete('/sub-category/:subcatId', SubCategory.subcategoryDelete);

// Subcategpory part

router.post('/brand', Brand.brandCreate);
router.get('/brand', Brand.brandGet);
router.put('/brand/:brandId', Brand.brandEdit);
router.delete('/brand/:brandId', Brand.brandDelete);

// router.get('/get-profile', Seller.profileFetch);

module.exports = router;
