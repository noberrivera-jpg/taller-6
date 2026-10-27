// aquí se consulta la API y se muestran los productos

const URL_API = 'https://dummyjson.com/products'
const CANTIDAD_PRODUCTOS = 20   // cantidad de productos que se muestran

let listaProductos = []         // guarda los productos para el buscador

// catálogo (index.html)

function extraerProductos() {
    const endPoint = URL_API + '?limit=' + CANTIDAD_PRODUCTOS
    console.info(endPoint)
    mostrarMensaje('Cargando productos...', false)

    fetch(endPoint)
        .then(respuesta => {
            if (!respuesta.ok) {
                throw new Error('Error HTTP ' + respuesta.status)
            }
            return respuesta.json()
        })
        .then(respuestaJSON => {
            if (!Array.isArray(respuestaJSON.products) || respuestaJSON.products.length === 0) {
                mostrarMensaje('No hay productos disponibles en este momento.', true)
                return
            }
            listaProductos = respuestaJSON.products
            ocultarMensaje()
            mostrarProductos(listaProductos)
            activarBuscador()
        })
        .catch(error => {
            console.error(error)
            mostrarMensaje('No se pudo cargar el catálogo. Revisa tu conexión e inténtalo de nuevo.', true)
        })
}

function mostrarProductos(productos) {
    const cuadricula = document.getElementById('cuadriculaProductos')
    limpiarContenedor(cuadricula)

    if (productos.length === 0) {
        mostrarMensaje('No se encontraron productos que coincidan con la búsqueda.', false)
        return
    }
    ocultarMensaje()

    productos.forEach(producto => {
        const tarjeta = crearTarjetaProducto(producto)
        agregarElemento(cuadricula, tarjeta)
    })
}

function crearTarjetaProducto(producto) {
    const tarjeta = crearElemento('article', 'tarjetaProducto')

    // Imagen (también es clicable)
    const contenedorImagen = crearElemento('div', 'tarjetaImagen')
    const imagen = crearImagen(producto.thumbnail, producto.title, 'puntero')
    imagen.addEventListener('click', function () {
        irADetalle(producto.id)
    })
    agregarElemento(contenedorImagen, imagen)
    agregarElemento(tarjeta, contenedorImagen)

    // Información
    const cuerpo = crearElemento('div', 'tarjetaCuerpo')
    agregarElemento(cuerpo, crearTexto('p', producto.category, 'categoria'))
    agregarElemento(cuerpo, crearTexto('h3', producto.title, 'nombreProducto'))

    const filaPrecio = crearElemento('div', 'filaPrecio')
    agregarElemento(filaPrecio, crearTexto('span', formatearPrecio(producto.price), 'precio'))
    agregarElemento(filaPrecio, crearTexto('span', '★ ' + producto.rating, 'calificacion'))
    agregarElemento(cuerpo, filaPrecio)

    agregarElemento(cuerpo, crearTexto('p', 'Stock: ' + producto.stock, 'stock'))

    // Botón para seleccionar el producto
    const boton = crearTexto('button', 'Ver producto', 'botonVer')
    boton.type = 'button'
    boton.addEventListener('click', function () {
        irADetalle(producto.id)
    })
    agregarElemento(cuerpo, boton)

    agregarElemento(tarjeta, cuerpo)
    return tarjeta
}

// Envía el identificador real del producto a producto.html como parámetro GET
function irADetalle(idProducto) {
    window.location.href = 'producto.html?id=' + idProducto
}

function activarBuscador() {
    const buscador = document.getElementById('buscador')
    buscador.addEventListener('input', function () {
        const texto = buscador.value.trim().toLowerCase()
        const filtrados = listaProductos.filter(producto =>
            producto.title.toLowerCase().includes(texto) ||
            producto.category.toLowerCase().includes(texto)
        )
        mostrarProductos(filtrados)
    })
}

// detalle del producto (producto.html)

function extraerProducto(id) {
    const idNumero = Number(id)

    if (id === null || !Number.isInteger(idNumero) || idNumero < 1) {
        mostrarMensaje('El identificador del producto no es válido.', true)
        return
    }

    const endPoint = URL_API + '/' + idNumero
    console.info(endPoint)
    mostrarMensaje('Cargando producto...', false)

    fetch(endPoint)
        .then(respuesta => {
            if (respuesta.status === 404) {
                throw new Error('NO_ENCONTRADO')
            }
            if (!respuesta.ok) {
                throw new Error('Error HTTP ' + respuesta.status)
            }
            return respuesta.json()
        })
        .then(producto => {
            ocultarMensaje()
            mostrarDetalleProducto(producto)
        })
        .catch(error => {
            console.error(error)
            if (error.message === 'NO_ENCONTRADO') {
                mostrarMensaje('No existe un producto con el identificador ' + idNumero + '.', true)
            } else {
                mostrarMensaje('No se pudo cargar el producto. Revisa tu conexión e inténtalo de nuevo.', true)
            }
        })
}

function mostrarDetalleProducto(producto) {
    const contenedor = document.getElementById('detalleProducto')
    limpiarContenedor(contenedor)
    document.title = producto.title

    const tarjeta = crearElemento('article', 'detalleTarjeta')

    // Columna de la imagen
    const panelImagen = crearElemento('div', 'detalleImagen')
    const rutaImagen = (producto.images && producto.images.length > 0) ? producto.images[0] : producto.thumbnail
    agregarElemento(panelImagen, crearImagen(rutaImagen, producto.title))
    agregarElemento(tarjeta, panelImagen)

    // Columna de la información
    const panelInfo = crearElemento('div', 'detalleInfo')
    agregarElemento(panelInfo, crearTexto('p', producto.category, 'categoria'))
    agregarElemento(panelInfo, crearTexto('h2', producto.title, 'detalleNombre'))
    agregarElemento(panelInfo, crearTexto('p', formatearPrecio(producto.price), 'detallePrecio'))
    agregarElemento(panelInfo, crearTexto('p', producto.description, 'detalleDescripcion'))

    const datos = crearElemento('div', 'detalleDatos')
    // Algunos productos de la API (p. ej. groceries) no traen el campo brand
    const marca = producto.brand ? producto.brand : 'Sin marca'
    agregarElemento(datos, crearDato('Calificación', '★ ' + producto.rating))
    agregarElemento(datos, crearDato('Stock', producto.stock))
    agregarElemento(datos, crearDato('Marca', marca))
    agregarElemento(datos, crearDato('Descuento', producto.discountPercentage + '%'))
    agregarElemento(panelInfo, datos)

    agregarElemento(tarjeta, panelInfo)
    agregarElemento(contenedor, tarjeta)
}

function crearDato(etiqueta, valor) {
    const caja = crearElemento('div', 'dato')
    agregarElemento(caja, crearTexto('span', etiqueta, 'datoEtiqueta'))
    agregarElemento(caja, crearTexto('span', valor, 'datoValor'))
    return caja
}
