
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
    res.render("products", {products:products , user:req.user} );
});


router.get("/shopping_cart", (req, res) => {
    res.render("products", {products:products} );
});




module.exports = router;
