
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



// total_price: String,
// items: [{item:String, amount:Number}]

shopping_c = [{
    total_price: "500",
    items:  [{iphone12: 1} , {air_pos_pro :2}] }];

router.get("/shopping_cart", (req, res) => {
    res.render("shopping_cart", {shopping_c:shopping_c , user:req.user} );
});




module.exports = router;
