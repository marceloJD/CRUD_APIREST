let jwt = require('jsonwebtoken');
const Products = require('../model/Products');
const Result = require('../model/DTO/Result');

const getProducts = async (req, res) => {
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let productList;
    try {
        const products = new Products();
        productList = await products.getAll(); 
    } catch (error) {
        res.json(new Result(true,500,[],"ERROR"));
        return;
    }
    
    
    res.json(new Result(false,200,productList,"OK"));

    

};

module.exports = getProducts;
