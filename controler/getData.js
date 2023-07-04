const Users = require('../model/Users');
const appRoot = require('app-root-path');
const Result = require('../model/DTO/Result')

const getData = async (req, res) => {
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let list;
    try {
        const users = new Users();
        list = await users.get(user); 
    } catch (error) {
        res.json(new Result(true,500,[],"ERROR"));
        return;
    }       
    res.json(new Result(false,200,list,"OK"));
};

module.exports = getData;
