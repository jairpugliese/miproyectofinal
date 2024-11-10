document.addEventListener('DOMContentLoaded', () => {
    const baseDatos = [
        {
            id: 1,
            nombre: 'iPhone 12, descripción',
            precio: 1200000,
            imagen: 'assets/img/iPhone1.png',
            categoria: 'iPhone'
        },
        {
            id: 2,
            nombre: 'iPhone 13, descripción',
            precio: 1250000,
            imagen: 'assets/img/iPhone2.png',
            categoria: 'iPhone'
        },
        {
            id: 3,
            nombre: 'Samsung, descripción',
            precio: 1200000,
            imagen: 'assets/img/iphone3.png',
            categoria: 'Samsung'
        }
    ];

    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonvaciar = document.querySelector('#boton-vaciar');
    const DOMfiltroCategoria = document.querySelector('#filtro');

    // Contador de visitas
    function actualizarContadorVisitas() {
        let visitas = localStorage.getItem('contadorVisitas');
        if (!visitas) {
            visitas = 0;
        }
        visitas++;
        localStorage.setItem('contadorVisitas', visitas);
        document.getElementById('contador').textContent = visitas;
    }

    actualizarContadorVisitas();

    // Renderizar productos
    function renderizarProductos(categoriaSeleccionada = 'todos') {
        DOMitems.textContent = ''; // Limpiar los productos existentes

        // Filtrar productos por categoría
        const productosFiltrados = categoriaSeleccionada === 'todos'
            ? baseDatos
            : baseDatos.filter(producto => producto.categoria === categoriaSeleccionada);

        productosFiltrados.forEach((info) => {
            const miNodo = document.createElement('div');
            miNodo.classList.add('card', 'col-sm-4');

            const miNodoCardBody = document.createElement('div');
            miNodoCardBody.classList.add('card-body');

            const miNodoTitle = document.createElement('h6');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = info.nombre;

            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', info.imagen);

            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-text');
            miNodoPrecio.textContent = `${divisa}${info.precio}`;

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anadirProductoAlCarrito);

            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMitems.appendChild(miNodo);
        });
    }

    function anadirProductoAlCarrito(evento) {
        const idProducto = parseInt(evento.target.getAttribute('marcador'));
        const producto = baseDatos.find(producto => producto.id === idProducto);
        const productoEnCarrito = carrito.find(item => item.id === idProducto);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }

        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        carrito.forEach((item) => {
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
            miNodo.textContent = `${item.cantidad} x ${item.nombre} - ${divisa}${item.precio * item.cantidad}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.dataset.id = item.id;
            miBoton.addEventListener('click', borrarItemCarrito);

            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });

        const totalProductos = contarProductosEnCarrito();
        document.getElementById('carrito-value').textContent = totalProductos; // Actualizamos el contador visual
        DOMtotal.textContent = calcularTotal();
    }

    function borrarItemCarrito(evento) {
        const id = parseInt(evento.target.dataset.id);
        carrito = carrito.filter(item => item.id !== id);
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    function calcularTotal() {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0).toFixed(2);
    }

    // Función para contar el total de productos en el carrito
    function contarProductosEnCarrito() {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        guardarCarritoEnLocalStorage();
    }

    DOMbotonvaciar.addEventListener('click', vaciarCarrito);

    function guardarCarritoEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    }

    // Cargar carrito y productos al iniciar
    cargarCarritoDeLocalStorage();
    renderizarProductos();

    // Agregar funcionalidad al filtro
    DOMfiltroCategoria.addEventListener('change', (evento) => {
        const categoriaSeleccionada = evento.target.value;
        renderizarProductos(categoriaSeleccionada); // Llamar a la función de renderizar con la categoría seleccionada
    });
});
