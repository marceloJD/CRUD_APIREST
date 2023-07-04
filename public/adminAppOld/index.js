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
                row += '<td><button class="btn btn-danger"  onclick="formEdit(' +item.id +')">Editar</button><button class="btn btn-danger " style="margin-left: 20px;" onclick="erase(' +item.id +')">Eliminar</button></td>';
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
    Swal.fire({
      title: 'Ingreso de Producto',
      html: `
        <form id="insertForm">
          <div class="form-group">
            <label for="product">Nombre:</label>
            <input type="text" class="form-control" id="product" name="product" required>
            <div class="invalid-feedback">Este campo es obligatorio</div>
          </div>

          <div class="form-group">
            <label for="price">Precio:</label>
            <input type="number" class="form-control" id="price" name="price" required>
            <div class="invalid-feedback">Este campo es obligatorio</div>
          </div>

          <div class="form-group">
            <label for="quantity">Cantidad Inicial:</label>
            <input type="number" class="form-control" id="quantity" name="quantity" required>
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
          const product = document.getElementById('product').value;
          const price = document.getElementById('price').value;
          const quantity = document.getElementById('quantity').value;

          return { name: product, price: price, stock: quantity };
        } else {
          form.classList.add('was-validated');
          return false;
        }
      }
    }).then((result) => {
      if (result && result.isConfirmed) {
        const data = result.value;
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
                })
              console.log(responseData);
              actualize()
            })
            .catch(error => {
                Swal.fire({
                    title: 'Mensaje',
                    text: 'Ingreso fallido',
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
              console.error('Error:', error);
            });
      }
    });
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