// Variables globales

const d = document;
let clienteInput = d.querySelector(".cliente");
let productoInput = d.querySelector(".producto");
let precioInput = d.querySelector(".precio");
let imagenInput = d.querySelector(".imagen");
let observacionInput = d.querySelector(".observacion");
let btnGuardar = d.querySelector(".btn-guardar");
let tabla = d.querySelector(".table > tbody")

// Defino la variable de filtroInput
let filtroInput = d.querySelector(".filtro");



// Agregar evento click al boton del formulario
btnGuardar.addEventListener("click", () => {
   // alert(clienteInput.value);
   let datos = validarFormulario();
   if(datos != null) {
       guardarDatos(datos);
   }
   borrarTabla();
   mostrarDatos();
});


// Agrego evento al filtro sin necesidad de click ni recargar la página
filtroInput.addEventListener("input", () => {
    let texto = filtroInput.value;
    borrarTabla();
    mostrarDatos(texto);
})

// Función para validar los campos del formulario

function validarFormulario(){
    let datosForm;
    if (clienteInput.value == "" || productoInput.value == "" || precioInput.value == "" || imagenInput.value == ""){
        alert("Todos los campos del formulario son obligatorios")
        return;

    } else {
        datosForm = {
            cliente: clienteInput.value,
            producto: productoInput.value,
            precio: precioInput.value,
            imagen: imagenInput.value,
            observacion: observacionInput.value
        }
    
    console.log(datosForm);

    clienteInput.value = "";
    productoInput.value = "";
    precioInput.value = "";
    imagenInput.value = "";
    observacionInput.value = "";

    return datosForm;
    }
}

const listadoPedidos = "Pedidos";    // Defino una constante global 

function guardarDatos(datos){        // Funcion guardar datos en el localStorage

    let pedidos = [];
    
    // Extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse (localStorage.getItem(listadoPedidos));

    // Validar datos guardados previamente en el localStorage
    if(pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }

    // Agregar el pedido nuevo al array
    pedidos.push(datos);

    // Guardar en localStorage
    localStorage.setItem (listadoPedidos, JSON.stringify (pedidos));

    // Validar que los datos fueron guardados
    alert("Datos guardados con exito");
}


// Funcion para extraer los datos en el localStorage
function mostrarDatos(filtro = ""){      // le paso el parametro filtro vacio 
    let pedidos = [];
    // Extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse (localStorage.getItem(listadoPedidos));

    // Validar datos guardados previamente en el localStorage
    if(pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }

    // Le agrego a cada pedido su posición real en el localStorage
    let pedidosConIndice = pedidos.map((p,i) => ({...p, indiceReal: i}));

    // Si hay texto escrito, dejo solo los clientes que Empiecen por ese texto
    let pedidosMostrar = filtro === "" 
    ? pedidosConIndice
    : pedidosConIndice.filter(p => p.cliente.toLowerCase().startsWith(filtro.toLowerCase()));

    // console.log(pedidos);
    

    // Mostrar los datos en la tabla
    pedidosMostrar.forEach((p,i) => {
        let fila = d.createElement("tr");
        fila.classList.add("table-warning")
        fila.innerHTML = `
            <td>${i+1}</td>
            <td>${p.cliente}</td>
            <td>${p.producto}</td>
            <td>${p.precio}</td>
            <td> <img src="${p.imagen}" width="65%"></td>
            <td>${p.observacion}</td>
            <td>
            <span onclick="actualizarPedido(${i})"class="btn-editar btn btn-warning">✏️</span>
            <span onclick="eliminarPedido(${i})" class="btn-eliminar btn btn-danger">❌</span>
            </td>
        `;
        tabla.appendChild(fila);
    });

}

// Quitar los datos de la tabla
function borrarTabla(){
    let filas = d.querySelectorAll(".table tbody tr");
    console.log(filas);
    filas.forEach((f)=>{
        f.remove();
    })
}

// Función eliminar un pedido de la tabla
function eliminarPedido(pos){
    let pedidos = [];
    // Extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse (localStorage.getItem(listadoPedidos));

    // Validar datos guardados previamente en el localStorage
    if(pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }
    // Confirmar pedido al eliminar
    let confirmar = confirm("¿Deseas eliminar el pedido del cliente" + pedidos[pos].cliente + "?");
    if(confirmar) {
        // alert("Lo eliminaste")
       pedidos.splice(pos, 1);
       alert("Pedido eliminado correctamente")

       // Guardar los datos que quedaron en localStorage
       localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
       
       borrarTabla();
       mostrarDatos();
    }
}

// Actualizar pedido
function actualizarPedido(pos) {
    let pedidos = [];
    // Extraer datos guardados previamente en el localStorage
    let pedidosPrevios = JSON.parse (localStorage.getItem(listadoPedidos));

    // Validar datos guardados previamente en el localStorage
    if(pedidosPrevios != null ){
        pedidos = pedidosPrevios;
    }

    // Pasar los datos al formulario para editarlos
    clienteInput.value = pedidos[pos].cliente;
    productoInput.value = pedidos[pos].producto;
    precioInput.value = pedidos[pos].precio;
    observacionInput.value = pedidos[pos].observacion;

    // Seleccionar el boton de actualizar
    let btnActualizar = d.querySelector(".btn-actualizar");
    btnActualizar.classList.toggle("d-none");
    btnGuardar.classList.toggle("d-none");

    // Agregar evento al boton de actualizar
    btnActualizar.addEventListener("click", function() {
        pedidos[pos].cliente = clienteInput.value;
        pedidos[pos].producto = productoInput.value;
        pedidos[pos].precio = precioInput.value;
        pedidos[pos].observacion = observacionInput.value;

        //Guardar los datos editados en localStorage
        localStorage.setItem(listadoPedidos, JSON.stringify(pedidos));
        alert("El dato fue actualizado con exito!!")
        clienteInput.value = "";
        productoInput.value = "";
        precioInput.value = "";
        observacionInput.value = "";

        btnActualizar.classList.toggle("d-none");
        btnGuardar.classList.toggle("d-none");

        borrarTabla();
        mostrarDatos();
    });
}


// Mostrar los datos de localStorage al recargar la pagina
d.addEventListener("DOMContentLoaded", function (){
    borrarTabla();
    mostrarDatos();
})