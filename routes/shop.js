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
    res.render("shopping-cart", { cartProducts: products, user: req.user , totalPrice: sum});
  }); 
});

router.post("/shopping-cart", (req, res) => {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId).then(user=>{
    res.redirect("/");
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
