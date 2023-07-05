/*
Armando Rodríguez
PreEntrega3Rodriguez.js

Página de tienda en línea que:
Agrega producto selccionado a un carrito
Hacer un arreglo con esos productos
Ver de manera dinámica las unidades, precio por las unidades y total
Alertas si hay productos duplicados, sin productos o total de productos
Guardar en almacenamiento local y llamar cada que se refresque la página
API para obtener imágenes de gatitos
Cargar una lista de inventario desde un archivo local
*/


//Fetch para consumir API y async-await
let url = `https://api.thecatapi.com/v1/images/search?limit=5`; //Declarar url de la api establecido hasta 5 imágenes
let api_key = "live_5y49XyQLIEleyrJCK9cm08ZZOhXzsXdAsAXFDEPd5UtzQCFTzs0HkANGBYGqFBcX"; //Declarar key para acceder a la api

async function fetch_Imagenes() { //Función para buscar imágenes declarada como función asincrónica
    try {
        let respuesta = await fetch(url, { //Uso de sentencia await como punto de espera
        headers: {'x-api-key': api_key} //Especificar encvabezados de la solicitud, incluyendo la clave
        });
        let data = await respuesta.json(); //Esperar a que la repsuesta se convierta a JSON
        
        data.forEach(imagenData => { //Cada elemento contien información de una imágen de gatos
        let imagen = document.createElement('img'); //Crear un elemento imagen
        imagen.src = `${imagenData.url}`; //La fuente de la imagen es la url 
        
        let celdas = document.createElement('div'); //Contenedores para las imagenes de gatos
        celdas.classList.add('col'); //Agregar la cals ecss "col"
        celdas.classList.add('col-lg'); //Agregar la cals ecss "col-lg" para estilos de diseño
        celdas.appendChild(imagen); //Agregar imagen como hijo del <div>
        document.getElementById('celdas').appendChild(celdas); //Buscar id celdas y agregar la imagen dentro
        });
    } catch (error) { //Capturar errores
        console.log(error); //Imprimir errores
    }
}

fetch_Imagenes(); //función par abuscar imágenes

//AJAX para cargar datos locales estáticos
window.onload = function() { //Función anónima que se ejecuta cada uqe se carga la página
    traer_Datos();
};

traer_Datos=()=>{
    let xhttp = new XMLHttpRequest(); //Instancia de objeto para solicitudes HTTP
    xhttp.open("GET", "../javascript/data.json", true); //tipo de solicitud  como get y su url de json, será asíncronico 
    xhttp.send(); //Enviar solicitud HTTP al servidor
    xhttp.onreadystatechange = function(){ //Función de devolución
        if(this.readyState == 4 && this.status == 200){ //Comprobar si su estado es 4(respuesta completa) y 200(respuesta exitosa), respuesta completa en tiempo
            let datos = JSON.parse(this.responseText); //Convertir respuesta a JSON

            let lista = document.querySelector('#resultado') //Seleccionar id resultados

            for(elemento of datos){ //Para cada elemento del arreglo de objetos datos crear un arreglo en la lista
                lista.innerHTML +=`
                <tbody>
                    <th>${elemento.num}</th>
                    <td>${elemento.producto}</td>
                    <td>${elemento.precio}</td>
                    <td>${elemento.SKU}</td>
                </tbody>`
            }
        }
    }
}

//Abrir carrito 
openNav=()=>{
    let sidebar = document.getElementById("mySidebar");
    if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
        sidebar.style.width = "1000px";
    }
}

//Cerrar carrito
closeNav=()=>{
    let sidebar = document.getElementById("mySidebar");
    if (sidebar.style.display === "block") {
        sidebar.style.width = "0px";
        sidebar.style.display = "none";
    }
}

let carrito = []; //Arreglo de productos de carrito vacío

let btn_compra = document.querySelectorAll(".btn_compra"); //Seleccionar todo itags clase btn_compra de botón compra
let btn_checkout = document.getElementById("btn_checkout"); //Seleccionar la clase de botón checkout
btn_checkout.addEventListener("click", check_out_carrito); //Para el único botón check out añadir función check out carrito
window.addEventListener("load", cargar_carrito); //Cuando carga la página, se llama función cargar_carrito

for (let btn of btn_compra){ //Para cada elemento del arreglo botón compra añadir
    btn.addEventListener("click", agregar_carrito); //Evento de click y acer función de agregar a carrito
}

guardado_carrito=()=>{
    let carrito_JSON = JSON.stringify(carrito); //Guardar carrito como JSON
    localStorage.setItem("carrito", carrito_JSON); //Set de items del JSON en almacenamiento local
}

producto_ya_seleccionado=(nombre)=>{ //Función para verificar si ya se ha seleccionado el producto
    return carrito.some(producto => producto.nombre === nombre); //Regresar verdadero si some encontró un nombre idéntico en el arreglo del objetos de producto con nombre seleccionado
}

generar_SKU=()=>{ //Función para generar SKU
    return Math.floor(Math.random() * 900) + 100; //Regresa un número randoim de 3 dígitos
}

toasty_eliminar=(nombre)=>{ //Alerta Toasty
    Toastify({
        text: `Producto ${nombre} eliminado`,
        duration: 1000,
        position: "right",
        style: {
            background: "#fbd3db",
            color: "#943246"
        },
    }).showToast();
}

toasty_agregar=(nombre)=>{ //Alerta Toasty
    Toastify({
        text: `Producto ${nombre} agregado`,
        duration: 1000,
        position: "right",
        style: {
            background: "#d3e4db",
            color: "#2e7277"
        },
    }).showToast();
}

toasty_actualizar=(nombre)=>{ //Alerta Toasty
    Toastify({
        text: `${nombre} actualizado`,
        duration: 1000,
        position: "right",
        style: {
            background: "#ffdec7",
            color: "#fa6800"
        },
    }).showToast();
}

mostrar_carrito=()=>{ //Función para modificar el HTML
    let tabla = document.getElementById("tbody"); //Declarar una variable como el id tbody que es de la tabla
    tabla.innerHTML = ""; //Reseteo del bucle

    for (let producto of carrito) { //Para cada elemento del arreglo carrito
        if (producto.cantidad === 0) { //Verificar si el atributo de cantidad es exactamente igual a 0
            continue; //Omitir resto del bucle, no renderizar producto
        }

        let fila = document.createElement(`tr`); //Declarar una variable como la creación de una etriqueta tr dentro del HTML
        fila.innerHTML = //Bloque de texto que se va a crear dentro del tr creado dentro del HTML
                `<td class="mostrar_carrito">
                    <img src="${producto.img}" class="img_add">
                    <p class="producto_nombre">${producto.nombre}</p>
                </td>
                <td> 
                    <div class="contador-container">
                        <button type="button" class="btn btn-secondary btn_cantidad">+</button>
                        <p class="contador">${producto.cantidad}</p>
                        <button type="button" class="btn btn-secondary btn_cantidad">-</button>
                    </div>
                </td>
                <td>
                    <p>$<span class="precio_de_unidades">${producto.precio_unidades}</span></p>
                </td>
                <td>
                    <button class="btn btn-danger btn_borrar">Borrar</button>
                </td>`;

        tabla.append(fila); //Insertar fila creada
    }

    let btn_borrar = document.querySelectorAll(".btn_borrar"); //Seleccionar todos los tags clase btn_borrar
    for (let btn of btn_borrar) { //Para cada elemento del arreglo de btn_borrar
        btn.addEventListener("click", borrar_carrito); //Añadir evento de click y mandar a llamar función borrar_carrito
    }

    let btn_cantidad = document.querySelectorAll(".btn_cantidad"); //Seleccionar todos los tags clase btn_cantidad
    for (let btn of btn_cantidad) { //Para cada elemento del arreglo de btn_cantidad
        btn.addEventListener("click", actualizar_cantidad); //Añadir evento de click y mandar a llamar función para actualizar cantidad
    }

    total_tabla(); //Mandar a llamar función total_tabla
}

total_tabla=()=>{ //Función para modificar el total en la tabla
    let total = carrito.reduce((acumulador, producto) => acumulador + producto.precio_unidades, 0); //Reducir a un único valor del arreglo carrito el atributo precio y acumular
    let td_total = document.getElementById("td_total"); //Declarar una variable como id td_total
    td_total.innerHTML = `$ ${total}`; //Cambiar el html interno de tabla total
}

function cargar_carrito(){ //Función para cargar carrito
    let recuperar_carrito = localStorage.getItem("carrito"); //Mandar a llamar almacenamiento local con clave carrito
    if(recuperar_carrito){ //Verificar si realmente hay datos almacenados fuera de undefined o null
        recuperar_carrito = JSON.parse(recuperar_carrito); //Convertir archivo JSON a arreglo de JS
        carrito = recuperar_carrito; //Sobre escribit arreglo carrito con arreglo recuperar_carrito
        mostrar_carrito(); //Función mostrar carrito
    }
}

function check_out_carrito(){ //Función del total de la tabla a una alerta
    let total = document.getElementById("td_total").innerText; //Obtener el texto interno del id td_total que es de la tabla
    if(carrito.length>0){ //Si el largo del arreglo es mayor a 0 entonces
        //Imprimir un HTML bootstrap dentro del id alerta
        Swal.fire({
            title:"¿Desea agregar algo más?",
            text: `Favor de pagar ${total}`,
            showDenyButton: true,
            denyButtonText: `Continuar comprando`,
            confirmButtonText: '¡Comprar!',
            confirmButtonColor: '#075d76',
            color: "#2e7277",
            background: "#d3e4db",
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
        }).then((result)=>{
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'sucess',
                    title: '¡Gracias por su compra!',
                    text: 'vuelva pronto',
                    confirmButtonColor: '#075d76',
                    color: "#2e7277",
                    background: "#d3e4db",
                })
                carrito = []; //Limpiar carrito
                localStorage.removeItem("carrito"); // Eliminar el carrito del almacenamiento local
                mostrar_carrito(); // Actualizar la visualización del carrito
                closeNav();
            }
        });
    }else{ //Si el largo del arreglo no es mayor a 0 entonces
        Toastify({
            text: "El carrito está vacío",
            duration: 3000,
            position: "right",
            style: {
                background: "#fbd3db",
                color: "#943246"
            },
        }).showToast();
        total = 0; //Resetear valor de total para confirmar que todo elemento esté vacío
        total.innerHTML = `${total}`; //Resetear el valor interno del HTML con id td_total a cero
        carrito = []; //Limpiar carrito
        localStorage.clear(); //Limpiar almacenamiento local
    } 
    guardado_carrito(); //Llamar función de guardar en JSON
}

function agregar_carrito(e){ //Función para agregar a carrito
    let tarjeta = e.target.parentNode.parentNode; //Composición parent del botón Añadir con relación a su tarjeta
    let nombre_producto = tarjeta.querySelector("h3").textContent; //Obtener el texto del h3 de la tarjeta
    let precio_producto = tarjeta.querySelector("span").textContent; //Obtener el texto del span de la tarjeta
    let img_producto = tarjeta.querySelector("img").src; //Obtener la ruta de la imagen de la tarjeta

    if (producto_ya_seleccionado(nombre_producto)){ //Si el producto seleccionado regresa verdadero entonces
        Toastify({
            text: `El producto ${nombre_producto} ya se ha agregado`,
            duration: 3000,
            position: "right",
            style: {
                background: "#fff3cd",
                color: "#936113"
            },
        }).showToast();
                        
    }else{ ////Si el producto seleccionado regresa falso entonces
        let producto = { //Construir objeto
            nombre: nombre_producto, //Elementos de la tarjeta
            precio: parseInt(precio_producto),
            precio_unidades: parseInt(precio_producto),
            cantidad: 1, //La selección predispone una unidad
            img: img_producto,
        };
        carrito.push(producto); //Empujar objeto creado al arreglo carrito
        mostrar_carrito(); //Función para modificar el HTML
        toasty_agregar(nombre_producto);
    };
    carrito.forEach(carrito=>{ //Para cada elemento del arreglo carrito
        carrito.SKU = generar_SKU(); //Crear atributo SKU que es el mandar a llamar función generar_SKU
    })
    guardado_carrito(); //Función guardar en carrito
    openNav();
}

function borrar_carrito(e){ //Función para eliminar un producto
    let fila = e.target.parentNode.parentNode; //Declarar variable como, de en d0nde sucede el evento y sacar su abuelo
    fila.remove(); //Remover fila del HTML
    let producto_nombre = fila.querySelector(".producto_nombre").textContent; //Seleccionar todo contenido texto de id producto_nombre desde su abuelo parent
    toasty_eliminar(producto_nombre);
    carrito = carrito.filter(producto => producto.nombre !== producto_nombre); //Filtrar, pasan los objetos del arreglo carrito que no tengan el nombre del producto a borrar
    guardado_carrito(); //Llamar función de guardar en JSON
    total_tabla(); //Mandar a llamar función total_tabla
}

function actualizar_cantidad(e) { //Función para actualizar cantidad
    let contador = e.target.parentNode.querySelector(".contador"); //Seleccionar el id contador de donde ocurre el evento y sacar su padre
    let cantidad = parseInt(contador.textContent); //Convertir el dato de texto interno a integer
    let accion = e.target.textContent; //Del lugar en donde ocurre, regresa + o - como contenido del texto
    let producto_nombre = e.target.parentNode.parentNode.parentNode.querySelector(".producto_nombre").textContent; //Seleccionar id producto_nombre para obtener nombre del producto desde la composición bisabuelo

    if (accion === "+") { //Si la acción es texto +
        cantidad++; //Aumentar cantidad
        toasty_actualizar(producto_nombre);
    }else if (accion === "-"){ //Si la acción es texto -
        if (cantidad > 0) { //Y cantidad mayor a 0
            cantidad--; //Reducir cantidad
            toasty_actualizar(producto_nombre);
        }
    }
    contador.textContent = cantidad; //El texto dentro del lugar contador ahora es la cantidad

    let producto = carrito.find((p) => p.nombre === producto_nombre); //Declarar una variable como un objeto con el primer resultado de coincidir con atributos nombre y producto_nombre
    producto.cantidad = cantidad; //Sobre escritura con el atributo de la cantidad

    if (cantidad === 0){ //Si la cantidad es exactamente igual a 0 entonces
        let fila = e.target.parentNode.parentNode.parentNode; //Declarar variable como, de donde ocurre el evento obtener su bisabuelo 
        fila.remove(); //Remover
        producto_nombre = fila.querySelector(".producto_nombre").textContent; //Seleccionar texto con id producto_nombre para sacar el nombre del producto
        carrito = carrito.filter((producto)=> producto.nombre !== producto_nombre); //Filtrar del arreglo carrito todo elemento que no sea igual a lo obtenido en el paso anterior
    }

    producto.precio_unidades = producto.cantidad*producto.precio; //Tomar el objeto producto y declarar su atributo precio_unidades multiplicando su cantidad y precio
    let precio_de_unidades = e.target.parentNode.parentNode.parentNode.querySelector(".precio_de_unidades"); //Declarar variable de precio de unidades como en donde ocurre el evento y obtener su bisabuelo
    precio_de_unidades.innerHTML = `${producto.precio_unidades}`; //Reemplazar ese texto con la información del arreglo de objeto
    guardado_carrito();  //Función guardar en carrito
    total_tabla(); //Mandar a llamar función para modificar el total de la tabla
}

/*
Fin de código
*/
