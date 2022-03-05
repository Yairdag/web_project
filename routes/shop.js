const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");
const user = require("../models/user");

const router = require('express').Router();

router.get("/products", (req, res) => {
    Product.find()
        .then(products => {
            res.render("products", { products: products, user: req.user });
        })
        .catch(err => {
            console.log(err);
        });
});

router.get("/shopping-cart", (req, res) => {
    User.findById(req.user.id)
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId.toJSON() } };
            });

            let sum = 0
            for (p of products) {
                sum += (p.quantity * p.product.price)
            }
            res.render("shopping-cart", { cartProducts: products, user: req.user, totalPrice: sum });
        });
});

router.post("/delete-cart-item", (req, res) => {
    const prodId = req.body.productId;
    console.log(prodId);
    req.user.removeFromCart(prodId).then(user => {
        res.redirect("/shopping-cart");
    });
});

router.post("/add-product", function (req, res) {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        url: req.body.url,
    });
    newProduct.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/products");
        }
    });
});

router.get("/add-product", function (req, res) {
    res.render("admin/add-product");
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


router.post("/cart", (req, res) => {
    const prodId = req.body.productId;
    res.redirect("/");
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        });
});

router.post("/order", (req, res) => {
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

router.get("/orders", (req, res) => {
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
        .then(orders => {
            res.render('user-orders', {
                orders: orders, user: req.user
            });
        })
        .catch(err => console.log(err));
});

module.exports = router;
