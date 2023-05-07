class nodoHash {
    constructor(carnet, usuario, password) {
        this.carnet = carnet
        this.usuario = usuario
        this.password = password
    }
}

class TablaHash {
    constructor() {
        this.tabla = new Array(7)
        this.capacidad = 7
        this.utilizacion = 0
    }

    insertar(carnet, usuario, password) {
        let indice = this.calculoIndice(carnet)
        const nuevoNodo = new nodoHash(carnet, usuario, password)
        if (indice < this.capacidad) {
            try {
                if (this.tabla[indice] == null) {
                    this.tabla[indice] = nuevoNodo
                    this.utilizacion++
                    this.capacidad_tabla()
                } else {
                    let contador = 1
                    indice = this.RecalculoIndice(carnet, contador)
                    while (this.tabla[indice] != null) {
                        contador++
                        indice = this.RecalculoIndice(carnet, contador)
                    }
                    this.tabla[indice] = nuevoNodo
                    this.utilizacion++
                    this.capacidad_tabla()
                }
            } catch (err) {
                console.log("Hubo un error en insercion")
            }
        }
    }

    calculoIndice(carnet) {
        let carnet_cadena = carnet.toString()
        let divisor = 0
        for (let i = 0; i < carnet_cadena.length; i++) {
            divisor = divisor + carnet_cadena.charCodeAt(i)
        }
        let indice_final = divisor % this.capacidad
        return indice_final
    }

    capacidad_tabla() {
        let aux_utilizacion = this.capacidad * 0.75
        if (this.utilizacion > aux_utilizacion) {
            this.capacidad = this.nueva_capacidad()
            this.utilizacion = 0
            this.ReInsertar()
        }
    }

    nueva_capacidad() { //Sustituir por un algoritmo del siguiente numero primo
        let numero = this.capacidad + 1;
        while (!this.isPrime(numero)) {
            numero++;
        }
        return numero;
    }

    ReInsertar() {
        const auxiliar_tabla = this.tabla
        this.tabla = new Array(this.capacidad)
        auxiliar_tabla.forEach((alumno) => {
            this.insertar(alumno.carnet, alumno.usuario, alumno.password)
        })
    }

    RecalculoIndice(carnet, intento) {
        let nuevo_indice = this.calculoIndice(carnet) + intento * intento
        let nuevo = this.nuevo_Indice(nuevo_indice)
        return nuevo
    }

    nuevo_Indice(numero) {
        let nueva_posicion = 0
        if (numero < this.capacidad) {
            nueva_posicion = numero
        } else {
            nueva_posicion = numero - this.capacidad
            nueva_posicion = this.nuevo_Indice(nueva_posicion)
        }
        return nueva_posicion
    }

    busquedaUsuario(carnet, pass_en) {
        let indice = this.calculoIndice(carnet)
        if (indice < this.capacidad) {
            try {
                if (this.tabla[indice] == null) {
                    alert("No se encontro el alumno")
                } else if (this.tabla[indice] != null && this.tabla[indice].carnet == carnet) {
                    if (this.tabla[indice].password == pass_en) {
                        alert("Bienvenido " + this.tabla[indice].usuario)
                    } else {
                        alert("Contraseña incorrecta")
                    }
                } else {
                    let contador = 1
                    indice = this.RecalculoIndice(carnet, contador)
                    while (this.tabla[indice] != null) {
                        if (this.tabla[indice].carnet == carnet) {
                            if (this.tabla[indice].password == pass_en) {
                                alert("Bienvenido " + this.tabla[indice].usuario)
                            } else {
                                alert("Contraseña incorrecta")
                            }
                            return
                        }
                        contador++
                        indice = this.RecalculoIndice(carnet, contador)
                    }
                }
            } catch (err) {
                console.log("Hubo un error en busqueda")
            }
        }
    }


    genera_tabla() {
        var body = document.getElementById("tabla-alumnos1");
        var divtable = document.createElement("div");
        var tabla = document.createElement("table");
        var tblBody = document.createElement("tbody");
        var salto_html = document.createElement("br")
        divtable.className = "container"
        tabla.className = "table"
        var encabezado = document.createElement("tr")
        var celda_encabezado = document.createElement("td");
        var encabezado_contenido = document.createTextNode("Carnet")
        celda_encabezado.appendChild(encabezado_contenido);
        encabezado.appendChild(celda_encabezado)
        tblBody.appendChild(encabezado)
        celda_encabezado = document.createElement("td");
        encabezado_contenido = document.createTextNode("Nombre")
        celda_encabezado.appendChild(encabezado_contenido);
        encabezado.appendChild(celda_encabezado)
        tblBody.appendChild(encabezado)
        celda_encabezado = document.createElement("td");
        encabezado_contenido = document.createTextNode("Password")
        celda_encabezado.appendChild(encabezado_contenido);
        encabezado.appendChild(celda_encabezado)
        tblBody.appendChild(encabezado)

        for (var i = 0; i < this.capacidad; i++) {
            if (this.tabla[i] != null) {
                var hilera = document.createElement("tr");
                var arreglo = new Array(3)
                arreglo[0] = this.tabla[i].carnet
                arreglo[1] = this.tabla[i].usuario
                arreglo[2] = this.tabla[i].password
                for (var j = 0; j < 3; j++) {
                    var celda = document.createElement("td");
                    var textoCelda = document.createTextNode(arreglo[j]);
                    celda.appendChild(textoCelda);
                    hilera.appendChild(celda);
                }
                tblBody.appendChild(hilera);
            }
        }


        divtable.appendChild(tabla)
        tabla.appendChild(tblBody);
        body.appendChild(salto_html);
        body.appendChild(divtable);
        tabla.setAttribute("border", "2");
    }

    isPrime(numero) {
        if (numero <= 1) { return false }
        if (numero === 2) { return true }
        if (numero % 2 === 0) { return false }
        for (let i = 3; i <= Math.sqrt(numero); i += 2) {
            if (numero % i === 0) { return false };
        }
        return true;
    }

    async sha256(mensaje) {
        let cadenaFinal
        const enconder = new TextEncoder();
        const mensajeCodificado = enconder.encode(mensaje)
        await crypto.subtle.digest("SHA-256", mensajeCodificado)
            .then(result => { // 100 -> 6a 
                const hashArray = Array.from(new Uint8Array(result))
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
                cadenaFinal = hashHex
            })
            .catch(error => console.log(error))
        return cadenaFinal
    }

}



export const tablaHash = new TablaHash()
tablaPermisos();

function tablaPermisos() {
    var body = document.getElementsByTagName("body")[0];
    var divtable = document.createElement("div");
    var tabla = document.createElement("table");
    var tblBody = document.createElement("tbody");
    var salto_html = document.createElement("br")
    divtable.className = "container"
    tabla.className = "table"
    var encabezado = document.createElement("tr")
    var celda_encabezado = document.createElement("td");
    var encabezado_contenido = document.createTextNode("Propietario")
    celda_encabezado.appendChild(encabezado_contenido);
    encabezado.appendChild(celda_encabezado)
    tblBody.appendChild(encabezado)
    celda_encabezado = document.createElement("td");
    encabezado_contenido = document.createTextNode("Destino")
    celda_encabezado.appendChild(encabezado_contenido);
    encabezado.appendChild(celda_encabezado)
    tblBody.appendChild(encabezado)
    celda_encabezado = document.createElement("td");
    encabezado_contenido = document.createTextNode("Ubicacion")
    celda_encabezado.appendChild(encabezado_contenido);
    encabezado.appendChild(celda_encabezado)
    tblBody.appendChild(encabezado)
    celda_encabezado = document.createElement("td");
    encabezado_contenido = document.createTextNode("Archivo")
    celda_encabezado.appendChild(encabezado_contenido);
    encabezado.appendChild(celda_encabezado)
    tblBody.appendChild(encabezado)
    celda_encabezado = document.createElement("td");
    encabezado_contenido = document.createTextNode("Permisos")
    celda_encabezado.appendChild(encabezado_contenido);
    encabezado.appendChild(celda_encabezado)
    tblBody.appendChild(encabezado)

    const data = JSON.parse(localStorage.getItem("alumnos"));
    for (let i = 0; i < data.length; i++) {
        if (localStorage.getItem('"' + data[i].carnet + '"' + "permiso") !== null) {
            const permisocarnetlen = localStorage.getItem('"' + data[i].carnet + '"' + "permisocarnet");
            const filenamelen = localStorage.getItem('"' + data[i].carnet + '"' + "filename");
            const permisolen = localStorage.getItem('"' + data[i].carnet + '"' + "permiso");
            const permisocarnetsplit = permisocarnetlen.split(",");
            const filenamesplit = filenamelen.split(",");
            const permisosplit = permisolen.split(",");

            for (let j = 0; j < filenamesplit.length; j++) {
                const fila = document.createElement("tr");
                const celda_propietario = document.createElement("td");
                const texto_propietario = document.createTextNode(localStorage.getItem('"' + data[i].carnet + '"' + "propietario"));
                celda_propietario.appendChild(texto_propietario);
                fila.appendChild(celda_propietario);

                const celda_destino = document.createElement("td");
                const texto_destino = document.createTextNode(permisocarnetsplit[j]);
                celda_destino.appendChild(texto_destino);
                fila.appendChild(celda_destino);

                const celda_ubicacion = document.createElement("td");
                const texto_ubicacion = document.createTextNode("/raiz");
                celda_ubicacion.appendChild(texto_ubicacion);
                fila.appendChild(celda_ubicacion);

                const celda_archivo = document.createElement("td");
                const texto_archivo = document.createTextNode(filenamesplit[j]);
                celda_archivo.appendChild(texto_archivo);
                fila.appendChild(celda_archivo);

                const celda_permisos = document.createElement("td");
                const texto_permisos = document.createTextNode(permisosplit[j]);
                celda_permisos.appendChild(texto_permisos);
                fila.appendChild(celda_permisos);

                tblBody.appendChild(fila);
            }
        }
    }
    divtable.appendChild(tabla)
    tabla.appendChild(tblBody);
    body.appendChild(salto_html);
    body.appendChild(divtable);
    tabla.setAttribute("border", "2");
}


async function busqueda() {
    let carnet = document.getElementById("valor").value;
    let pass = document.getElementById("passw").value;
    let pass_en = await tablaHash.sha256(pass)
    tablaHash.busquedaUsuario(carnet, pass_en)
}