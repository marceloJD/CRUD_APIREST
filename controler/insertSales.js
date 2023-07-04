let jwt = require('jsonwebtoken');
const Sales = require('../model/Sales');
const Result = require('../model/DTO/Result');

const insertSales =async (req,res)=>{
    const user = req.cookies.user;
    const role = req.cookies.role;
    const jwt = req.cookies.jwt;
    // VERIFICAR ROL VALIDO PARA LA ACCION : TODO

    let { total,array  } = req.body; /// TODO 

    const groupedSales = array.reduce((result, sale) => {
        const { id, quantity } = sale;
        const sanitizedQuantity = Math.max(Math.floor(quantity), 0);
        
        if (result[id]) {
            result[id].quantity += sanitizedQuantity;
        } else {
            result[id] = { ...sale, quantity: sanitizedQuantity };
        }
        
        return result;
    }, {});
       
    
    array = Object.values(groupedSales);
    
    let result ;
    const sales = new Sales();
    try {        
        result = await sales.insertSale(user,total)
    } catch (error) {
        res.json(new Result(true,500,false,"ERROR"));
        return;
    }
    let result2 ;
    try {
        result2 = await sales.checkStock(array)
    } catch (error) {
        res.json(new Result(true,500,false,"ERROR"));
        return;
    }

    if(result2!=null){
        res.json(new Result(false,400,result2,"ERROR"));
        ///TODO: BORRAR VENTA
        return; 
    }
    let result3 ;
    try {
        result3 = await sales.insertSaleDetails(result,array)
    } catch (error) {
        ///TODO: BORRAR VENTA
        res.json(new Result(true,500,false,"ERROR"));
        return;
    }
    res.json(new Result(false,200,true,"OK"));
    
}

module.exports = insertSales