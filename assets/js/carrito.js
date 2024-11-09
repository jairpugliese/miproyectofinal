document.addEventListener('DOMContentLoaded', () => {
    const baseDatos = [
        {
            id: 1,
            nombre: 'iPhone 12, descripción',
            precio: 1200000,
            imagen: 'assets/img/iPhone1.png',
        },
        {
            id: 2,
            nombre: 'iPhone 13, descripción',
            precio: 12500000,
            imagen: 'assets/img/iPhone2.png'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonvaciar = document.querySelector('#boton-vaciar');
    const carritoContainer = document.getElementById("carrito-value");

    // Renderizar productos
    function renderizarProductos() {
        baseDatos.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            // Body
            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body', 'col-sm-4');

            // Título
            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;

            // Botón
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            // Insertamos
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    // Añadir producto al carrito
    function anadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'));
        renderizarCarrito();
        handleCarritoValue(carrito.length);
        guardarCarritoEnLocalStorage();
    }

    // Actualizar cantidad en el carrito
    function handleCarritoValue(value) {
        carritoContainer.textContent = value;
    }

    // Renderizar carrito
    function renderizarCarrito() {
        DOMcarrito.textContent = '';  // Limpiar HTML
        const carritoSinDuplicados = [...new Set(carrito)];  // Eliminar duplicados

        // Generar nodos
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDatos.filter((itemBaseDatos) => itemBaseDatos.id === parseInt(item))[0];
            const numeroUnidadesItem = carrito.reduce((total, itemId) => itemId === item ? total + 1 : total, 0);

            // Crear nodo
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem.nombre} - ${divisa}${miItem.precio}`;

            // Botón para borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);

            // Mezclar nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        // Actualizar total
        DOMtotal.textContent = calcularTotal();
    }

    // Borrar item del carrito
    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => carritoId !== id);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
        handleCarritoValue(carrito.length);
    }

    // Calcular total
    function calcularTotal() {
        return carrito.reduce((total, item) => {
            const miItem = baseDatos.filter((itemBaseDatos) => {
            return itemBaseDatos.id===parseInt(item);
        });
        return total + miItem[0].precio;

        },0).toFixed(2);
        
    }

    //vaciar carrito
    function vaciarCarrito(){
        carrito=[];
        renderizarCarrito();
    }

    // Guardar carrito en localStorage
    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Cargar carrito de localStorage
    function cargarCarritoDeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    }

    // Inicializar
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});
