const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

const router = require('express').Router();

products = [{
    name: "laptop",
    price: 400,
    imgUrl: "a",
    id: 1
}, {
    name: "phone",
    price: 200,
    imgUrl: "a",
    id: 2
}];

router.get("/products", (req, res) => {
    Product.find()
    .then(products => {
      res.render("products", { products: products, user: req.user });
    })
    .catch(err => {
      console.log(err);
    });
});



// total_price: String,
// items: [{item:String, amount:Number}]

shopping_c = [{
    total_price: "500",
    items: [{ iphone12: 1 }, { air_pos_pro: 2 }]
}];

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
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId.toJSON() } };
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
      res.render('shop/orders', {
        orders: orders,
      });
    })
    .catch(err => console.log(err));
});


module.exports = router;
