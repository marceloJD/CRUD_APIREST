
var sales = [];
var products = {
    //1:{ id: 1, name: 'Product1', price: 10, stock: 10 },
    //2:{ id: 2, name: 'Product2', price: 20, stock: 20 },
    //3:{ id: 3, name: 'Product3', price: 30, stock: 15 }
}
getProducts()
function getProducts(){
    fetch('/api/getProducts')
    .then(raw =>raw.json())
    .then(function(response) {
        console.log(response)
        if (!response.error) {
            let list=""
            for(let i = 0 ; i<response.result.length;i++){
                products[response.result[i].id]=response.result[i];
                list=list+`<option value='${response.result[i].id} - ${response.result[i].name} (${response.result[i].stock})'></option>`
            }
            document.getElementById('productList').innerHTML=list
        } else {
            alert("ERROR cargando los datos ...")
        }
    })
    .catch(function(error) {
        alert("ERROR")
        console.log(error)
    });
}



function sendSales(){
    let total =0;
    for(let i = 0 ; i<sales.length;i++){
        total=total+sales[i].price*sales[i].quantity;
    }
    console.log(sales)
    fetch('/api/insertSales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({array:sales,total})
      })
      .then(raw =>raw.json())
      .then(function(response) {
        console.log(response)
        if (response.error) {
            alert("ERROR")
          
        } else {
            if(response.status==200){
                sales = []
                getProducts()
                actualiceTable()
                alert("OK")
            }else{
                
                alert("STOCK INSUFICIENTE:"+response.result)
            }
            
        }
      })
      .catch(function(error) {
        alert("ERROR")
      });
}


function addSale() {
    var product = document.getElementById('product').value;
    var quantity = document.getElementById('quantity').value/1;
    product = product.split(' - ')[0]/1
    
    var sale = {
        id:product,
        name:products[product].name,
        price:products[product].price,
        quantity:quantity
    };

    sales.push(sale);

    actualiceTable();


    document.getElementById('product').value = '';
    document.getElementById('quantity').quantity = '';
}

function eraseSale(id) {
    console.log(sales)
    sales.splice(id,1)
    
    actualiceTable();
}

function actualiceTable() {
    var salesTable = document.getElementById('salesTable');
    salesTable.innerHTML = '';
    let total = 0;
    let i = 0
    sales.forEach(function(sale) {
        var row = '<tr>';
        row += '<td>' + sale.id + '</td>';
        row += '<td>' + sale.name + '</td>';
        row += '<td>' + sale.price + '</td>';
        row += '<td>' + sale.quantity + '</td>';
        row += '<td>' + sale.price*sale.quantity  + '</td>';
        row += '<td><button class="btn btn-danger" onclick="eraseSale(' +i +')">Borrar</button></td>';
        row += '</tr>';
        salesTable.innerHTML += row;
        total = total + sale.price*sale.quantity 
    });
    salesTable.innerHTML+= '<td>TOTAL:</td><td></td><td></td><td></td><td>'+total+'</td>'
}
