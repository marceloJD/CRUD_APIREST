
let jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const path = require('path');
const fs = require('fs');

const insertUsers = async (req, res) => {
    console.log("BODY:",req.body)
    console.log("BODY:",req.cookies)
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let result;
    let name =req.body.user;
    let  password =req.body.pass;    
    let address =req.body.adress;
    let role2 = 1
    const photoFile = req.file;
    fs.renameSync(photoFile.path, photoFile.path+ path.extname(photoFile.originalname));
    console.log(photoFile)
    try {
        const users = new Users();
        result = await users.insert(name, password, "BD/imgs/" + photoFile.filename + path.extname(photoFile.originalname), address, role2);

    } catch (error) {
        res.json(new Result(true,500,[],"ERROR"));
        return;
    }       
    res.json(new Result(false,200,result,"OK"));
};

module.exports = insertUsers;
