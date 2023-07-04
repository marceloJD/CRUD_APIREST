const jwt = require('jsonwebtoken');

const authenticateJWT = (user,role,token,ROLE) => {
    
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            
            return false;
        } else {
            console.log(decoded)
            
        }
        });
    } else {
        return false;
    }
};

module.exports = {SECRET_KEY,authenticateJWT}