actualize()
let products=[]
function actualize(){
    fetch('/api/getProducts')
    .then(raw =>raw.json())
    .then(function(response) {
        console.log(response)
        if (!response.error) {
            products=response.result
            var row=""
            for(let i = 0 ; i<response.result.length;i++){
                var item = response.result[i]
                row += '<tr>';
                row += '<td>' + item.id + '</td>';
                row += '<td>' + item.name + '</td>';
                row += '<td>' + item.price + '</td>';
                row += '<td>' + item.stock + '</td>';
                row += '<td><div class="text-center">';
                row += '<button class="btn btn-danger" onclick="formEdit(' + item.id + ')"><i class="fas fa-edit"></i> Editar</button>';
                row += '<button class="btn btn-danger" style="margin-left: 20px;" onclick="erase(' + item.id + ')"><i class="fas fa-trash-alt"></i> Eliminar</button>';
                row += '</div></td>';
                row += '</tr>';
            }
            document.getElementById('productTable').innerHTML=row
        } else {
            alert("ERROR cargando los datos ...")
        }
    })
    .catch(function(error) {
        alert("ERROR")
        console.log(error)
    });
}

function formInsert() {
  const form = document.getElementById('insertForm');
  const productInput = document.getElementById('product');
  const priceInput = document.getElementById('price');
  const quantityInput = document.getElementById('quantity');

  const product = productInput.value;
  const price = parseFloat(priceInput.value);
  const quantity = parseInt(quantityInput.value);

  let isValid = true;
  let errorMessage = '';

  if (product.trim()=='') {
    isValid = false;
    errorMessage += 'Ingrese el nombre del producto. \n';
  }

  if (isNaN(price) || price <= 0) {
    isValid = false;
    errorMessage += 'El precio debe ser un número positivo. \n';
  }

  if (isNaN(quantity) || quantity <= 0) {
    isValid = false;
    errorMessage += 'La cantidad debe ser un número positivo. \n';
  }

  if (isValid) {
    const data = { name: product, price: price, stock: quantity };

    fetch('/api/insertProduct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(responseData => {
        Swal.fire({
          title: 'Mensaje',
          text: 'Ingreso exitoso',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        console.log(responseData);
        actualize();
      })
      .catch(error => {
        Swal.fire({
          title: 'Mensaje',
          text: 'Ingreso fallido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Error:', error);
      });
  } else {
    form.classList.add('was-validated');
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
}

function formEdit(id){
    console.log(id)
    const p = item(id)
    if(p==null){
        return ;
    }

    Swal.fire({
        title: 'Edicion de Producto',
        html: `
          <form id="insertForm">
            <input type="hidden" class="form-control" id="id" name="id" value=${p.id}>
            <div class="form-group">
              <label for="product">Nombre:</label>
              <input value='${p.name}' type="text" class="form-control" id="product" name="product" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
  
            <div class="form-group">
              <label for="price">Precio:</label>
              <input value=${p.price} type="number" class="form-control" id="price" name="price" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
  
            <div class="form-group">
              <label for="quantity">Cantidad :</label>
              <input value=${p.stock} type="number" class="form-control" id="quantity" name="quantity" required>
              <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>
          </form>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        preConfirm: () => {
          const form = document.getElementById('insertForm');
          if (form.checkValidity()) {
            const id = document.getElementById('id').value;
            const product = document.getElementById('product').value;
            const price = document.getElementById('price').value;
            const quantity = document.getElementById('quantity').value;
  
            return { name: product, price: price, stock: quantity ,id:id};
          } else {
            form.classList.add('was-validated');
            return false;
          }
        }
      }).then((result) => {
        if (result && result.isConfirmed) {
          const data = result.value;
          fetch('/api/updateProduct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            })
              .then(response => response.json())
              .then(responseData => {
                  Swal.fire({
                  title: 'Mensaje',
                  text: 'Cambios guardados de manera exitosa',
                  icon: 'success',
                  confirmButtonText: 'OK'
                  })
                console.log(responseData);
                actualize()
              })
              .catch(error => {
                  Swal.fire({
                      title: 'Mensaje',
                      text: 'Cambio fallido',
                      icon: 'error',
                      confirmButtonText: 'OK'
                  })
                console.error('Error:', error);
              });
        }
      });
}

function erase(id) {
    Swal.fire({
      title: 'Confirmación',
      text: '¿Está seguro de que desea realizar esta acción?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/deleteProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                Swal.fire({
                    title: 'Mensaje',
                    text: 'Cambios guardados de manera exitosa',
                    icon: 'success',
                    confirmButtonText: 'OK'
                    })
                console.log(data);
                actualize()
            })
            .catch(error => {
                Swal.fire({
                    title: 'Mensaje',
                    text: 'Error, no se guardo el cambio...',
                    icon: 'error',
                    confirmButtonText: 'OK'
                    })
                console.error('Error:', error);
        });
      } 
    });
}
  
function item(id){
    for (let index = 0; index < products.length; index++) {
        if(products[index].id==id){
            return products[index];
        }
    }
    return null;
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


function downloadReport() {
  fetch('/api/getProducts')
    .then(raw => raw.json())
    .then(function(response) {
      if (!response.error) {
        const products = response.result;

        // Crear un nuevo documento PDF
        const doc = new jsPDF();

        // Configurar la tabla
        const tableData = [];
        const headers = ['ID', 'Nombre', 'Precio', 'Stock'];
        tableData.push(headers);

        // Agregar filas a la tabla
        for (let i = 0; i < products.length; i++) {
          const item = products[i];
          const row = [item.id, item.name, item.price, item.stock];
          tableData.push(row);
        }

        // Generar la tabla en el documento PDF
        doc.autoTable({
          head: [tableData[0]], // Cabecera de la tabla
          body: tableData.slice(1), // Filas de la tabla
          startY: 40, // Posición inicial de la tabla
        });
        // Obtener la altura de la página actual
        const pageHeight = 297
        const pageWidth = 210

        // Agregar título
        doc.setFontSize(16);
        const pageTitle = 'Reporte de Productos';
        const pageTitleWidth = doc.getTextWidth(pageTitle);
        doc.text(pageTitle, pageWidth/2-pageTitleWidth/2, 20);

        // Calcular el total de productos
        const totalProducts = products.length;

        

        // Agregar total al pie de página
        doc.setFontSize(12);
        doc.text(`Total de productos: ${totalProducts}`, 14, pageHeight - 10);

        // Descargar el documento PDF
        doc.save('reporte.pdf');
      } else {
        alert("ERROR cargando los datos...");
      }
    })
    .catch(function(error) {
      alert("ERROR");
      console.log(error);
    });
}
