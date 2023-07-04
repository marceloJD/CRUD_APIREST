actualize()
let products=[]
function actualize(){
    fetch('/api/getUsers')
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
                row += '<td>' + item.adress + '</td>';
                row += '<td>' + item.role + '</td>';
                
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
        alert("ERRORadasddsa")
        console.log(error)
    });
}


function formInsert() {
    const formulario = document.getElementById('insertForm');
    const user = formulario.user.value;
    const pass = formulario.pass.value;
    const rePass = formulario.rePass.value;
    const adress = formulario.adress.value;
    const photo = formulario.photo.files[0];
  
    const formData = new FormData();
    formData.append('user', user);
    formData.append('pass', pass);
    formData.append('rePass', rePass);
    formData.append('adress', adress);
    formData.append('photo', photo);
  
    fetch('/api/insertUsers', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        actualize()
        if (data.result) {

          // El usuario se insertó correctamente
          Swal.fire({
            icon: 'success',
            title: 'Usuario insertado',
            text: 'El usuario se ha insertado correctamente.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            formulario.reset();
          });
        } else {
          // Hubo un error al insertar el usuario
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un error al insertar el usuario.',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error en la solicitud.',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      });
}
  

function formEdit(id) {
    console.log(id);
    const p = item(id);
    if (p == null) {
        return;
    }

    Swal.fire({
        title: 'Edicion de Producto',
        html: `
        <form id="editForm" enctype="multipart/form-data">
        <div class="form-group">
            <label for="product">Usuario(Correo):</label>
            <input type="mail" class="form-control" id="user" name="user" value='${p.name}' required>
            <div class="invalid-feedback">Este campo es obligatorio</div>
        </div>
        <div class="form-group">
            <label for="product">Contraseña:</label>
            <input type="password" class="form-control" id="pass" name="pass"  required>
            <div class="invalid-feedback">Este campo es obligatorio</div>
        </div>
        

        <div class="form-group">
            <label for="product">Direccion:</label>
            <input type="text" class="form-control" id="adress" name="adress"  value='${p.adress}' required>
            <div class="invalid-feedback">Este campo es obligatorio</div>
        </div>

        <div class="form-group">
            <label for="photo">Foto de perfil:</label>
            <div class="custom-file">
                <input type="file" class="custom-file-input" id="photo" name="photo" required>
                <label class="custom-file-label" for="photo">Seleccionar archivo</label>
            </div>
            <div class="invalid-feedback">Este campo es obligatorio</div>
            </div>                                
        </form>
        `,
        showCloseButton: true,
        showConfirmButton: true,
        focusConfirm: false,
        preConfirm: () => {
            const form = document.getElementById('editForm');
            if (form.checkValidity()) {
                const user = form.user.value;
                const pass = form.pass.value;
                const adress = form.adress.value;
                const photo = form.photo.files[0];

                const formData = new FormData();
                formData.append('id', id);
                formData.append('name', user);
                formData.append('password', pass);
                formData.append('adress', adress);
                formData.append('photo', photo);

                return formData;
            } else {
                form.classList.add('was-validated');
                return false;
            }
        }
    }).then((result) => {
        if (result && result.isConfirmed) {
            const data = result.value;
            fetch('/api/updateUsers', {
                method: 'POST',
                body: data
            })
                .then(response => response.json())
                .then(responseData => {
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambios guardados de manera exitosa',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    console.log(responseData);
                    actualize();
                })
                .catch(error => {
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambio fallido',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
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
        fetch('/api/deleteUsers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if(data.result){
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Cambios guardados de manera exitosa',
                        icon: 'success',
                        confirmButtonText: 'OK'
                        })
                    console.log(data);
                }else{
                    Swal.fire({
                        title: 'Mensaje',
                        text: 'Error, no se guardo el cambio...',
                        icon: 'error',
                        confirmButtonText: 'OK'
                        })
                    console.error('Error:', error);
                }
                
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
        if(products[index].name==id){
            return products[index];
        }
    }
    return null;
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


function downloadReport() {
    fetch('/api/allSalesInfo')
      .then(raw => raw.json())
      .then(function(response) {
        if (!response.error) {
          const salesInfo = response.result;
  
          // Agrupar por vendedor
          const groupedSales = salesInfo.reduce((grouped, sale) => {
            const { vendedor, monto } = sale;
            if (!grouped[vendedor]) {
              grouped[vendedor] = {
                vendedor,
                ventas: 0,
              };
            }
            grouped[vendedor].ventas += monto;
            return grouped;
          }, {});
  
          // Crear un nuevo documento PDF
          const doc = new jsPDF();
  
          // Configurar la tabla
          const tableData = [];
          const headers = ['Nombre', 'Dirección', 'Rol', 'Ventas Totales'];
          tableData.push(headers);
  
          // Agregar filas a la tabla
          for (const vendedor in groupedSales) {            
            const { vendedor: nombre, ventas } = groupedSales[vendedor];
            let d = item(nombre)
            const row = [nombre, d.adress, d.role, ventas];
            tableData.push(row);
          }
          for (const vendedor of products) {
            let encontrado = false
            for (const vendedor1 of tableData) {                
                if(vendedor1[0]==vendedor.name){
                    encontrado = true;
                    break;
                }
            }
            if(!encontrado){
                tableData.push([vendedor.name,vendedor.adress,vendedor.role,0]);
            }
          }
  
          // Generar la tabla en el documento PDF
          doc.autoTable({
            head: [tableData[0]], // Cabecera de la tabla
            body: tableData.slice(1), // Filas de la tabla
            startY: 40, // Posición inicial de la tabla
          });
  
          // Obtener la altura de la página actual
          const pageHeight = 297;
          const pageWidth = 210;
  
          // Agregar título
          doc.setFontSize(16);
          const pageTitle = 'Reporte de Trabajadores';
          const pageTitleWidth = doc.getTextWidth(pageTitle);
          doc.text(pageTitle, pageWidth / 2 - pageTitleWidth / 2, 20);
  
          // Calcular el total de ventas
          let totalSales = 0;
          for (const vendedor in groupedSales) {
            totalSales += groupedSales[vendedor].ventas;
          }
  
          // Agregar total al pie de página
          doc.setFontSize(12);
          doc.text(`Total de ventas: ${totalSales}`, 14, pageHeight - 10);
  
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
  
  