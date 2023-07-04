var sales = [];
var products = {};

getProducts();

function getProducts() {
  fetch('/api/getProducts')
    .then(raw => raw.json())
    .then(function(response) {
      console.log(response)
      if (!response.error) {
        let list = "";
        for (let i = 0; i < response.result.length; i++) {
          products[response.result[i].id] = response.result[i];
          list = list + `<option value='${response.result[i].name}'></option>`;
        }
        document.getElementById('productList').innerHTML = list;
        console.log(products)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error cargando los datos...',
        });
      }
    })
    .catch(function(error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error',
      });
      console.log(error);
    });
}

function sendSales() {
  let total = 0;
  for (let i = 0; i < sales.length; i++) {
    total = total + sales[i].price * sales[i].quantity;
  }
  console.log(sales);
  fetch('/api/insertSales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ array: sales, total })
    })
    .then(raw => raw.json())
    .then(function(response) {
      console.log(response);
      if (response.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error',
        });
      } else {
        if (response.status == 200) {
          sales = [];
          getProducts();
          actualiceTable();
          Swal.fire({
            icon: 'success',
            title: 'OK',
            text: 'Venta realizada con éxito!',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Stock insuficiente: ' + response.result,
          });
        }
      }
    })
    .catch(function(error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error',
      });
    });
}

function addSale() {
  var product = document.getElementById('product').value;
  var quantity = document.getElementById('quantity').value / 1;
  var find = false;
  for (const key in products) {
    if (Object.hasOwnProperty.call(products, key)) {      
      if(products[key].name==product){
        product=(products[key]);
        find = true;
        break;
      }
    }
  }
  if(!find){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Producto no encontrado...'
    });
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Cantidad no permitida...'
    });
    return;
  }
  

  var sale = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity
  };

  sales.push(sale);

  actualiceTable();

  document.getElementById('product').value = '';
  document.getElementById('quantity').quantity = '';
}

function eraseSale(id) {
  console.log(sales);
  sales.splice(id, 1);

  actualiceTable();
}

function actualiceTable() {
  var salesTable = document.getElementById('salesTable');
  salesTable.innerHTML = '';
  let total = 0;
  let i = 0;
  sales.forEach(function(sale) {
    var row = '<tr>';
    row += '<td>' + sale.id + '</td>';
    row += '<td>' + sale.name + '</td>';
    row += '<td>' + sale.price + '</td>';
    row += '<td>' + sale.quantity + '</td>';
    row += '<td>' + sale.price * sale.quantity + '</td>';
    row += '<td><div class="text-center"><button class="btn btn-danger" onclick="eraseSale(' + i + ')"><i class="fas fa-trash"></i></button></div></td>';
    row += '</tr>';
    salesTable.innerHTML += row;
    total = total + sale.price * sale.quantity;
    i++;
  });
  salesTable.innerHTML += '<td>TOTAL:</td><td></td><td></td><td></td><td>' + total + '</td>';
  
}

getPhoto()
function getPhoto() {
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getPhoto')
      .then(response => response.blob())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
        console.log(blob)
        // Crear una URL para el objeto Blob
        const photoURL = URL.createObjectURL(blob);
  
        // Obtener el elemento de imagen en el DOM
        const photoElement = document.getElementById('USERPHOTO');
  
        // Asignar la URL de la foto al atributo src de la imagen
        photoElement.src = photoURL;
      })
      .catch(error => {
        console.error('Error al obtener la foto:', error);
      });
}

getData()
function getData() {
    console.log(123)
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getData')
      .then(response => response.json())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
        console.log("GFD:",blob)
        const photoElement = document.getElementById('USERNAME');
  
        // Asignar la URL de la foto al atributo src de la imagen
        photoElement.innerText = blob.result.name;
      })
      .catch(error => {
        console.error('Error al obtener la data:', error);
      });
}