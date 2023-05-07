import {desencriptacion, encriptacion} from './encriptacionAES.js'

class nodoBloque{
    constructor(index, fecha, emisor, receptor, mensaje, previousHash, hash){
        this.valor = {
            'index' : index,
            'timestamp': fecha,
            'transmitter': emisor,
            'receiver': receptor,
            'message': mensaje,
            'previoushash': previousHash,
            'hash': hash
        }
        this.siguiente = null
        this.anterior = null
    }
}

class Bloque{
    constructor(){
        this.inicio = null
        this.bloques_creados = 0
    }
    
    async insertarBloque(fecha, emisor, receptor, mensaje){
        if(this.inicio === null){
            let cadena = this.bloques_creados + fecha + emisor + receptor + mensaje
            let hash = await this.sha256(cadena)
            let mensajeEncriptado = await encriptacion(mensaje)
            const nuevoBloque = new nodoBloque(this.bloques_creados, fecha,emisor, receptor, mensajeEncriptado, '0000', hash)
            this.inicio = nuevoBloque
            this.bloques_creados++
        }else{
            let cadena = this.bloques_creados + fecha + emisor + receptor + mensaje
            let hash = await this.sha256(cadena)
            let mensajeEncriptado = await encriptacion(mensaje)
            let aux = this.inicio
            while(aux.siguiente){
                aux = aux.siguiente
            }
            const nuevoBloque = new nodoBloque(this.bloques_creados, fecha,emisor, receptor, mensajeEncriptado, aux.valor['hash'], hash)
            nuevoBloque.anterior = aux
            aux.siguiente = nuevoBloque
            this.bloques_creados++
        }
    }

    async sha256(mensaje){
        let cadenaFinal
        const enconder =  new TextEncoder();
        const mensajeCodificado = enconder.encode(mensaje)
        await crypto.subtle.digest("SHA-256", mensajeCodificado)
        .then(result => { // 100 -> 6a 
            const hashArray =  Array.from(new Uint8Array(result))
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
            cadenaFinal = hashHex
        })
        .catch(error => console.log(error))
        return cadenaFinal
    }
}

export const bloque = new Bloque()
let bloque_actual


function fechaActual(){
    let cadena = ''
    const fechaActual = new Date();
    cadena += fechaActual.getDate() < 10 ? ("0"+fechaActual.getDate()+"-") : (fechaActual.getDate()+"-")
    cadena += fechaActual.getMonth() < 10 ? ("0"+(fechaActual.getMonth()+1)+"-") : (fechaActual.getMonth()+"-")
    cadena += fechaActual.getFullYear() + "::"
    cadena += fechaActual.getHours() < 10 ? ("0"+fechaActual.getHours()+":") : (fechaActual.getHours()+":")
    cadena += fechaActual.getMinutes() < 10 ? ("0"+fechaActual.getMinutes()+":") : (fechaActual.getMinutes()+":")
    cadena += fechaActual.getSeconds() < 10 ? ("0"+fechaActual.getSeconds()) : (fechaActual.getSeconds())
    return cadena

}


const btnEnviar = document.getElementById("enviar")
btnEnviar.addEventListener("click", enviarMensaje)

const emisor =[] 
const receptor = []
const mensaje = []
const fecha = []
function enviarMensaje(){
    let aux_emisor=[]
    let aux_receptor=[]
    let aux_mensaje=[]
    let emisor_mensaje =  document.getElementById("emisor").value
    let receptor_mensaje = document.getElementById("receptor").value
    let mensaje_final = document.getElementById("mensaje").value
    let fecha_mensaje = fechaActual()
    aux_emisor.push(emisor_mensaje)
    aux_receptor.push(receptor_mensaje)
    aux_mensaje.push(mensaje_final)
    emisor.push(aux_emisor)
    receptor.push(aux_receptor)
    mensaje.push(aux_mensaje)
    fecha.push(fecha_mensaje)
    localStorage.setItem("emisor", JSON.stringify(emisor))
    localStorage.setItem("receptor", JSON.stringify(receptor))
    localStorage.setItem("mensaje", JSON.stringify(mensaje))
    localStorage.setItem("fecha", JSON.stringify(fecha))
    bloque.insertarBloque(fechaActual(),emisor_mensaje,receptor_mensaje,mensaje_final)
}

const btnReporte = document.getElementById("reporte")
btnReporte.addEventListener("click", reporte)

let cadenagrafo = ''
let cnt = 0
let grafolista = []

function reporte() {
  bloque_actual = bloque.inicio
  if (bloque_actual != null) {
    let cadena = "Index: " + bloque_actual.valor['index']
    cadena += "\nTimeStamp: " + bloque_actual.valor['timestamp']
    cadena += "\nEmisor: " + bloque_actual.valor['transmitter']
    cadena += "\nReceptor: " + bloque_actual.valor['receiver']
    cadena += "\nMensaje: " + bloque_actual.valor['message']
    cadena += "\nPreviousHash: " + bloque_actual.valor['previoushash']
    cadena += "\nHash: " + bloque_actual.valor['hash']
    document.getElementById("reporte-bloques").value = cadena
    mostrar_Mensaje_descriptado()
  }

  bloque_actual = bloque.inicio
  if (bloque_actual != null) {
    cadenagrafo += `n${cnt}[label="TimeStamp=${bloque_actual.valor['timestamp']} \n Emisor: ${bloque_actual.valor['transmitter']}\n Receptor: ${bloque_actual.valor['receiver']}\n PreviousHash: ${bloque_actual.valor['previoushash']}"],\n`;
    if (bloque_actual.siguiente !== null) {
      cadenagrafo += "n" + cnt + "->" + "n" + (cnt + 1) + ";\n"
    }
    cnt++
    bloque_actual = bloque_actual.siguiente
  }

  let grafoaux = []
  grafoaux.push(cadenagrafo)
  grafolista.push(grafoaux)
  localStorage.setItem("grafoBloc", (grafolista))
}


const btnReporte1 = document.getElementById("siguiente-bloque")
btnReporte1.addEventListener("click", reporte_siguente)

function reporte_siguente(){
    if(bloque_actual.siguiente != null){
        bloque_actual = bloque_actual.siguiente
        let cadena = "Index: " + bloque_actual.valor['index']
        cadena += "\nTimeStamp: " + bloque_actual.valor['timestamp']
        cadena += "\nEmisor: " + bloque_actual.valor['transmitter']
        cadena += "\nReceptor: " + bloque_actual.valor['receiver']
        cadena += "\nMensaje: " + bloque_actual.valor['message']
        cadena += "\nPreviousHash: " + bloque_actual.valor['previoushash']
        cadena += "\nHash: " + bloque_actual.valor['hash']
        document.getElementById("reporte-bloques").value = cadena
        mostrar_Mensaje_descriptado()
    }
}

const btnReporte2 = document.getElementById("anterior-bloque")
btnReporte2.addEventListener("click", reporte_anterior)

function reporte_anterior(){
    if(bloque_actual.anterior != null){
        bloque_actual = bloque_actual.anterior
        let cadena = "Index: " + bloque_actual.valor['index']
        cadena += "\nTimeStamp: " + bloque_actual.valor['timestamp']
        cadena += "\nEmisor: " + bloque_actual.valor['transmitter']
        cadena += "\nReceptor: " + bloque_actual.valor['receiver']
        cadena += "\nMensaje: " + bloque_actual.valor['message']
        cadena += "\nPreviousHash: " + bloque_actual.valor['previoushash']
        cadena += "\nHash: " + bloque_actual.valor['hash']
        document.getElementById("reporte-bloques").value = cadena
        mostrar_Mensaje_descriptado()
    }
}

async function mostrar_Mensaje_descriptado(){ 
    let cadena =  await desencriptacion(bloque_actual.valor['message'])
    document.getElementById("reporte-mensajes").value = cadena
}