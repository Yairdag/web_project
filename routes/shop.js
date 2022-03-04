const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

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
    res.render("shopping-cart", { cartProducts: req.user.cart.items, user: req.user });
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
    console.log("hi");
    const prodId = req.params.productId;
    console.log(prodId);
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
        console.log('DESTROYED PRODUCT');
        res.redirect('/products');
      })
      .catch(err => console.log(err));
});


router.post("/cart", (req, res) => {
    const prodId = req.body.productId;
    console.log(prodId);
    res.redirect("/");
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
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
                userId: req.user
            });
            return order.save();
        })
        .then(() => {
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
