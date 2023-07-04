
function _init(data){
    console.log("_init:",data)
    var input = document.getElementById('vendedor');
    var desdeInput = document.getElementById('desde');
    var hastaInput = document.getElementById('hasta');
    var canvas = document.getElementById('grafico');
    var generar = document.getElementById('generar');

    var chart = new ChartLine(data, input, canvas, desdeInput, hastaInput,generar);

    let graficoTorta = document.getElementById('grafico-torta')
    let botonAlternarGraficoTorata=document.getElementById('alternar-btn-grafico-torta')

    let chart2 = new ChartPie(graficoTorta, data, botonAlternarGraficoTorata);
    //KPIS

    TOTAL = data.reduce((total, venta) => total + venta.monto, 0);

    AVRG = TOTAL / data.length;

    const userSales = {};
    data.forEach(venta => {
    if (!userSales[venta.vendedor]) {
        userSales[venta.vendedor] = 0;
    }
    userSales[venta.vendedor] += venta.monto;
    });
    USER = Object.keys(userSales).reduce((maxUser, user) => {
    if (!maxUser || userSales[user] > userSales[maxUser]) {
        return user;
    }
    return maxUser;
    }, "");

    const productSales = {};
    data.forEach(venta => {
    venta.productos.forEach(producto => {
        if (!productSales[producto.nombre]) {
        productSales[producto.nombre] = 0;
        }
        productSales[producto.nombre] += producto.monto;
    });
    });
    PRDUCT = Object.keys(productSales).reduce((maxProduct, product) => {
    if (!maxProduct || productSales[product] > productSales[maxProduct]) {
        return product;
    }
    return maxProduct;
    }, "");
    document.getElementById("USER").innerText = USER;
    document.getElementById("AVRG").innerText = AVRG.toFixed(2);
    document.getElementById("TOTAL").innerText = TOTAL.toFixed(2);
    document.getElementById("PRODUCT").innerText = PRDUCT;
}




fetch('/api/allSalesInfo')
.then(raw =>raw.json())
.then(function(response) {
    _init(response.result)
})
.catch(function(error) {
    alert("ERRORRORORO")
    console.log(error)
});

getPhoto()
function getPhoto() {
    // Hacer una solicitud HTTP al controlador getPhoto
    fetch('/api/getPhoto')
      .then(response => response.blob())  // Obtener la respuesta como un objeto Blob
      .then(blob => {
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