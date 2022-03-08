const Product = require("../models/product");
const Order = require("../models/order");
const router = require('express').Router();


/**
 * -------------- POST ROUTES ----------------
 */

router.post('/add-product', (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    const newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        url: req.body.url,
    });
    newProduct.save((err) => {
        if (err) {
            console.error(err);
        }
        else {
            res.redirect('/products');
        }
    });
});

router.post('/edit-product', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    const prodId = req.body.productId;
    const updatedTitle = req.body.name;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;

    Product.findById(prodId)
        .then(product => {
            product.name = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {
            console.log(result);
            res.redirect('/products');
        })
        .catch(err => console.log(err));
});

router.post('/update-order', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }

    const orderId = req.body.prodId;
    const quantities = orderId.map((_, i) => req.body[`quantity${i}`]);
    const delivery = req.body.delivery;
    console.log(orderId);
    console.log(quantities);
    console.log(delivery);

    return res.redirect('/all-orders');
});

router.post('/delete-order', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    const orderId = req.body.orderId;
    Order.findByIdAndRemove(orderId)
        .then(() => {
            res.redirect('/all-orders');
        })
        .catch(err => console.log(err));
});

router.post('/delete-product', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            res.redirect('/products');
        })
        .catch(err => console.log(err));
});

router.post('/delete-order-item', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    req.body.orderId;
    req.body.prodToRemove;
});



/**
 * -------------- GET ROUTES ----------------
 */

router.get("/add-product", function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    res.render("admin/add-product", { user: req.user });
});

router.get('/edit-product/:productId', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                product: product,
            });
        })
        .catch(err => console.log(err));
});



router.get('/edit-order/:orderId', function (req, res) {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/home');
    }
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.redirect('/');
            }
            res.render('admin/edit-order', {
                order: order, user: req.user
            });
        })
        .catch(err => console.log(err));
});


router.get("/all-orders", (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
        return res.redirect('/home');
    }
    Order.find()
        .populate('userId')
        .then(orders => {
            console.log(orders);
            res.render('admin/all-orders', {
                orders: orders, user: req.user
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;