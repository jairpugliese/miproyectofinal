
                document.addEventListener('DOMContentLoaded',()=>{
                    const baseDatos=[
                        {
                            id:1,
                            nombre:'iPhone 12, descripción',
                            precio: 1200000,
                            imagen: 'assets/img/iPhone1.png',
                        },
                        {
                            id:2,
                            nombre:'iPhone 13, descripción',
                            precio: 12500000,
                            imagen: 'assets/img/iPhone2.png'
                        }
                    ];
                    let carrito =[];
                    const divisa = '$';
                    const DOMitems = document.querySelector('#items');
                    const DOMcarrito = document.querySelector('#carrito');
                    const DOMtotal = document.querySelector('#total');
                    const DOMbotonvaciar = document.querySelector('#boton-vaciar');
                

                // sección de funcion para el carrito
                function renderizarProductos(){
                    baseDatos.forEach((info) =>{
                        const miNodo = document.createElement('div');
                        miNodo.classList.add('card','col-sm-4');

                        //body
                        const miNodoCardBody = document.createElement('div');
                        miNodoCardBody.classList.add('card-body','col-sm-4');

                        //titulo
                        const miNodoTitle = document.createElement('h6');
                        miNodoTitle.classList.add('card-title');
                        miNodoTitle.textContent = info.nombre;
                        //imagen
                        const miNodoImagen = document.createElement('img');
                        miNodoImagen.classList.add('img-fluid');
                        miNodoImagen.setAttribute ('src', info.imagen);
                        //precio
                        const miNodoPrecio = document.createElement('p');
                        miNodoPrecio.classList.add('card-text');
                        miNodoPrecio.textContent = ${divisa}${info.precio};

                        //boton
                        const MiNodoBoton = document.createElement('button');
                        MiNodoBoton.classList.add('btn','btn-primary');
                        MiNodoBoton.textContent='Agregar';
                        MiNodoBoton.setAttribute('marcador',info.id);
                        MiNodoBoton.addEventListener('click',anadirProductoAlCarrito);
                        //insertamos
                        miNodoCardBody.appendChild(miNodoImagen);
                        miNodoCardBody.appendChild(miNodoTitle);
                        miNodoCardBody.appendChild(miNodoPrecio);
                        miNodo.appendChild(miNodoCardBody);
                        DOMitems.appendChild(miNodo);
                        
                    });
                }
                //evento para añadir un producto al carrito de compra
                function anadirProductoAlCarrito(evento){
                    carrito.push(evento.target.getAttribute('marcador'))
                    renderizarCarrito();
                        handleCarritoValue(carrito.length)
                }
                function handleCarritoValue(value){
                    const carritoContainer = document.getElementById("carrito-value");
                    carritoContainer.textContent=${value}
                }

                //dibujar todos los guardados del carrito 
                function renderizarCarrito(){
                    //vaciar html
                    DOMcarrito.textContent = '';
                    //quitar duplicados
                    const carritoSinDuplicados = [... new Set(carrito)];
                    //generación de los nodos
                    carritoSinDuplicados.forEach((item)=>{
                        //obtenemos el item que necesitamos de la base de datos
                        const miItem = baseDatos.filter((itemBaseDatos)=>{
                            return itemBaseDatos.id ===parseInt(item);
                        });
                        //cantidad de veces que se repite el producto
                        const numeroUnidadesItem = carrito.reduce((total,itemId)=>{
                            return itemId===item ? total+= 1 : total;
                        },0);
                        //creamos el nodp del item del carrito
                        const miNodo=document.createElement('li');
                        miNodo.classList.add('list-group-item','text-right', 'mx-2');
                        miNodo.textContent=${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa};

                        //boton borrar
                        const MiBoton = document.createElement('button');
                        MiBoton.classList.add('btn','btn-danger','mx-5');
                        MiBoton.textContent='X';
                        MiBoton.style.marginLeft='1rem';
                        MiBoton.dataset.item=item;
                        MiBoton.addEventListener('click',borrarItemCarrito);
                        //mezclamos nodo
                        miNodo.appendChild(MiBoton);
                        DOMcarrito.appendChild(miNodo);

                    });


                }

                //para borrar elementos del carrito
                function borrarItemCarrito(evento) {
                const id = evento.target.dataset.item;
                // Borramos todos los productos
                carrito = carrito.filter((carritoId) => {
                  return carritoId !== id;
                });
                // volvemos a renderizar
                renderizarCarrito();
                guardarCarritoEnLocalStorage();

                handleCarritoValue(carrito.length)
                }

                renderizarProductos();
                renderizarCarrito();


            });

             