// funciones para crear elementos en la página

function crearElemento(etiqueta, clases) {
    const nodo = document.createElement(etiqueta)
    if (clases) {
        nodo.className = clases
    }
    return nodo
}

function crearTexto(etiqueta, texto, clases) {
    const nodo = crearElemento(etiqueta, clases)
    nodo.textContent = texto
    return nodo
}

function crearImagen(ruta, descripcion, clases) {
    const imagen = crearElemento('img', clases)
    imagen.src = ruta
    imagen.alt = descripcion
    return imagen
}

function agregarElemento(contenedor, elemento) {
    contenedor.appendChild(elemento)
}

function limpiarContenedor(contenedor) {
    contenedor.replaceChildren()
}

function mostrarMensaje(texto, esError) {
    const mensaje = document.getElementById('mensaje')
    mensaje.textContent = texto
    mensaje.className = esError ? 'mensaje mensajeError' : 'mensaje'
    mensaje.hidden = false
}

function ocultarMensaje() {
    document.getElementById('mensaje').hidden = true
}

function formatearPrecio(valor) {
    return '$' + Number(valor).toFixed(2)
}
