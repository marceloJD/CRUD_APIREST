let express  =  require('express');
require('dotenv').config();
let app = express();

const multer = require('multer');
const upload = multer({ dest: 'BD/imgs' });

const dbHost = process.env.SECRET_KEY;
console.log(dbHost);

let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let path = require('path');



app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const login = require('./controler/login.js')
const insertSales = require('./controler/insertSales.js')

const getProducts = require('./controler/getProducts.js')
const insertProduct = require('./controler/insertProduct.js')
const updateProduct = require('./controler/updateProduct.js')
const deleteProduct = require('./controler/deleteProduct.js')

const allSalesInfo = require('./controler/allSalesInfo.js')

const getUsers = require('./controler/getUsers.js')
const insertUsers = require('./controler/insertUsers.js')
const deleteUsers = require('./controler/deleteUsers.js')
const updateUsers = require('./controler/updateUsers.js')
const getPhoto = require('./controler/getPhoto.js')
const getData = require('./controler/getData.js')

app.post('/api/login',login)

//HU1
app.post('/api/insertSales',insertSales)
app.get('/api/getProducts',getProducts)

//HU2
app.post('/api/insertProduct',insertProduct)

//HU3
app.get('/api/allSalesInfo',allSalesInfo)

//app.get('/api/getProducts',getProducts)
app.post('/api/updateProduct',updateProduct)
app.post('/api/deleteProduct',deleteProduct)

app.get('/api/getUsers',getUsers)
app.post('/api/insertUsers',upload.single('photo'),insertUsers)
app.post('/api/updateUsers',upload.single('photo'),updateUsers)
app.post('/api/deleteUsers',deleteUsers)
app.get('/api/getPhoto',getPhoto);
app.get('/api/getData',getData);


app.listen( 3000||process.env.PORT , ()=>{
    console.log("READY...")
});

