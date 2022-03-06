const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

const router = require('express').Router();


/* -------------- POST ROUTES ---------------- */

router.post("/delete-cart-item", (req, res) => {
    const prodId = req.body.productId;
    console.log(prodId);
    req.user.removeFromCart(prodId).then(user => {
        res.redirect("/shopping-cart");
    });
});

router.post('/add-product', (req, res) => {
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

router.post("/cart", (req, res) => {
    const prodId = req.body.productId;
    const quantity = parseInt(req.body.amount);

    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product, quantity);
        })
        .then(result => {
            res.redirect('/products');
        });
});


router.post("/checkout", (req, res) => {
    User.findById(req.user.id)
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.productId.toJSON() } };
            });
            const order = new Order({
                products: products,
                userId: req.user,
                total: req.body.total,
                delivery: req.body.delivery
            });
            return order.save();
        }).then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/');
        })
        .catch(err => console.log(err));
});


router.post('/edit-product', function (req, res) {
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

router.post('/delete-product', function (req, res) {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            res.redirect('/products');
        })
        .catch(err => console.log(err));
});

router.post('/update-order', function (req, res) {
    const orderId = req.body.prodId;
    const quantities = req.body.quantity;
    const delivery = req.body.delivery;
    console.log(orderId);
    console.log(quantities);
    console.log(delivery);
    return res.redirect('/all-orders');
});

router.post('/delete-order', function (req, res) {
    const orderId = req.body.orderId;
    Order.findByIdAndRemove(orderId)
        .then(() => {
            res.redirect('/admin/all-orders');
        })
        .catch(err => console.log(err));
});

router.post('/delete-order-item', function (req, res) {
    req.body.orderId;
    req.body.prodToRemove;
});

/* -------------- GET ROUTES ---------------- */


router.get("/products", (req, res) => {
    Product.find()
        .then(products => {
            res.render("products", { products: products, user: req.user });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get('/shopping-cart', (req, res) => {
    User.findById(req.user.id)
        .populate('cart.items.productId')
        .then((user) => {
            const products = user.cart.items.map((i) => {
                return { quantity: i.quantity, product: { ...i.productId.toJSON() } };
            });

            let totalPrice = 0;
            let totalAmount = 0;
            for (p of products) {
                totalPrice += p.quantity * p.product.price;
                totalAmount += p.quantity;
            }
            res.render('shopping-cart', {
                cartProducts: products,
                user: req.user,
                totalPrice: totalPrice,
                totalAmount: totalAmount
            });
        });
});


router.get("/add-product", function (req, res) {
    res.render("admin/add-product", { user: req.user });
});

router.get('/edit-product/:productId', function (req, res) {
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
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return res.redirect('/');
            }
            res.render('admin/edit-order', {
                order: order,
            });
        })
        .catch(err => console.log(err));
});

router.get("/my-orders", (req, res) => {
    Order.find({ userId: req.user.id })
        .then(orders => {
            res.render('user-orders', {
                orders: orders, user: req.user
            });
        })
        .catch(err => console.log(err));
});

router.get("/all-orders", (req, res) => {
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
