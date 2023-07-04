
const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const Result = require('../model/DTO/Result');
const fs = require('fs');
const path = require('path');

const updateUsers = async (req, res) => {
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwtToken = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO
    let result;
    const id = req.body.id; // Obtener el ID del usuario a actualizar desde los parámetros de la solicitud
    let name =req.body.name;
    let  password =req.body.password;    
    let address =req.body.adress;
    let role2 = 1
    console.log(req.body)
    const photoFile = req.file;

    try {
        const users = new Users();

        if (photoFile) {
            // Cambiar el nombre del archivo para incluir la extensión original
            const newFileName = photoFile.filename + path.extname(photoFile.originalname);

            // Mover el archivo a la ubicación deseada
            const newFilePath = photoFile.path +path.extname(photoFile.originalname);

            fs.renameSync(photoFile.path, newFilePath);

            result = await users.update(id, name, password, newFileName, address, role2);
        } else {
            result = await users.update(id, name, password, '', address, role2);
        }
    } catch (error) {
        res.json(new Result(true, 500, [], "ERROR"));
        return;
    }
    
    res.json(new Result(false, 200, result, "OK"));
};

module.exports = updateUsers;


module.exports = updateUsers;
