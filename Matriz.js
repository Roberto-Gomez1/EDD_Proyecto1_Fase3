class nodoMatrizAdyacencia {
    constructor(valor) {
        this.siguiente = null
        this.abajo = null
        this.valor = valor
    }
}

class grafoDirigido {
    constructor() {
        this.principal = null
    }

    insertarF(texto) {
        const nuevoNodo = new nodoMatrizAdyacencia(texto)
        if (this.principal === null) {
            this.principal = nuevoNodo
        } else {
            let aux = this.principal
            while (aux.abajo) {
                if (aux.valor === nuevoNodo.valor) {
                    return
                }
                aux = aux.abajo
            }
            aux.abajo = nuevoNodo
        }
    }

    insertarC(padre, hijo) {
        const nuevoNodo = new nodoMatrizAdyacencia(hijo)
        if (this.principal !== null && this.principal.valor === padre) {
            let aux = this.principal
            while (aux.siguiente) {
                aux = aux.siguiente
            }
            aux.siguiente = nuevoNodo
        } else {
            this.insertarF(padre)
            let aux = this.principal
            while (aux) {
                if (aux.valor === padre) {
                    break;
                }
                aux = aux.abajo
            }
            if (aux !== null) {
                while (aux.siguiente) {
                    aux = aux.siguiente
                }
                aux.siguiente = nuevoNodo
            }
        }
    }

    insertarValores(padre, hijos) {
        let cadena = hijos.split(',')
        for (let i = 0; i < cadena.length; i++) {
            this.insertarC(padre, cadena[i])
        }
    }



    //Reporte modificado para trabajar con carpetas
    grafica() {
        let cadena = "graph grafoDirigido{ rankdir=LR; node [shape=box]; \"/\"; node [shape = ellipse] ; layout=neato; "
        let auxPadre = this.principal
        let auxHijo = this.principal
        let peso = 0
        while (auxPadre) {
            auxHijo = auxPadre.siguiente
            let profundidad = auxPadre.valor.split('/')
            let padre = ""
            if (profundidad.length == 2 && profundidad[1] == "") { peso = 1 }
            else if (profundidad.length == 2 && profundidad[1] != "") { peso = 2 }
            else { peso = profundidad.length }
            if (auxPadre.valor != "/") { padre = profundidad[profundidad.length - 1] }
            else { padre = "/" }
            while (auxHijo) {
                cadena += "\"" + padre + "\"" + " -- " + "\"" + auxHijo.valor + "\"" + " [label=\"" + peso + "\"] "
                auxHijo = auxHijo.siguiente
            }
            auxPadre = auxPadre.abajo
        }
        cadena += "}"
        return cadena
    }
}

function genera_tabla() {
    let nombree = localStorage.getItem("nombrealumno");
    let padre = localStorage.getItem(nombree + "padre");
    let hijos = localStorage.getItem(nombree + "hijos");
    let contador = localStorage.getItem(nombree + "contador");
    let padre1 = padre.split(',');
    let hijos1 = hijos.split(',');
    let contador1 = contador.split(',');
    var body = document.getElementsByTagName("body2")[0];
    var tablaAnterior = document.getElementById("tablaPadreHijo");
    if (tablaAnterior) {
        body.removeChild(tablaAnterior);
    }
    var tabla = document.createElement("table");
    tabla.setAttribute("id", "tablaPadreHijo");
    tabla.style.width = "300%"; // Ancho de la tabla
    tabla.style.height = "200px"; // Altura de la tabla
    var tblBody = document.createElement("tbody");
    var hilera = document.createElement("tr");
    var celda = document.createElement("td");
    var textoCelda = document.createTextNode("Padre");
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);
    tblBody.appendChild(hilera);
    var celda = document.createElement("td");
    var textoCelda = document.createTextNode("Hijo");
    celda.appendChild(textoCelda);
    hilera.appendChild(celda);
    tblBody.appendChild(hilera);
    for (let i = 0; i < padre1.length; i++) {
        const hijosCount = parseInt(contador1[i]);
        const hijosStartIndex = i > 0 ? parseInt(contador1.slice(0, i).reduce((a, b) => parseInt(a) + parseInt(b))) : 0;
        const hijosEndIndex = hijosStartIndex + hijosCount;

        var hilera = document.createElement("tr");

        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(padre1[i]);
        celda.appendChild(textoCelda);
        hilera.appendChild(celda);

        var celda = document.createElement("td");
        for (let j = hijosStartIndex; j < hijosEndIndex; j++) {
            var textoCelda = document.createTextNode(hijos1[j] + ", ");
            celda.appendChild(textoCelda);
        }
        hilera.appendChild(celda);

        tblBody.appendChild(hilera);
    }

    tabla.appendChild(tblBody);
    body.appendChild(tabla);
    tabla.setAttribute("border", "2");
    tabla.style.borderCollapse = "collapse";
    tabla.style.border = "solid black 1px";
    tabla.style.fontSize = "20px";
    tabla.style.textAlign = "center";
    tblBody.style.height = "100px"; // Altura del tbody
    hilera.style.height = "50px"; // Altura de las filas
    celda.style.width = "150px"; // Ancho de las celdas
}



const grafo = new grafoDirigido()
integrarGraf();
actualizarNombre();


function integrarGraf() {
    let nombree = localStorage.getItem("nombrealumno");
    let padre = localStorage.getItem(nombree + "padre");
    let hijos = localStorage.getItem(nombree + "hijos");
    let contador = localStorage.getItem(nombree + "contador");
    let padre1 = padre.split(',');
    let hijos1 = hijos.split(',');
    let contador1 = contador.split(',');
    for (let i = 0; i < padre1.length; i++) {
        const hijosCount = parseInt(contador1[i]);
        const hijosStartIndex = i > 0 ? parseInt(contador1.slice(0, i).reduce((a, b) => parseInt(a) + parseInt(b))) : 0;
        const hijosEndIndex = hijosStartIndex + hijosCount;
        for (let j = hijosStartIndex; j < hijosEndIndex; j++) {
            grafo.insertarValores(padre1[i], hijos1[j]);
            
        }
    }
    genera_tabla();
    refrescarGrafo();
}
const subirPadre = [];
const subirHijos = [];
const subirContador = [];
function insertar() {

    let padre = document.getElementById("padre").value;
    let hijos = document.getElementById("hijos").value;
    let nombree = localStorage.getItem("nombrealumno");
    let subirHijos1 = [];
    let auxiliar = hijos.split(',');
    for (let i = 0; i < auxiliar.length; i++) {
        subirHijos1.push(auxiliar[i]);
    }
    subirPadre.push(padre);
    subirHijos.push(subirHijos1);
    subirContador.push(subirHijos1.length);
    localStorage.setItem(nombree + "padre", subirPadre);
    localStorage.setItem(nombree + "hijos", subirHijos);
    localStorage.setItem(nombree + "contador", subirContador);
    grafo.insertarValores(padre, hijos);
    genera_tabla();
    refrescarGrafo();
}


const inputElement = document.getElementById("input");
inputElement.addEventListener("change", onChange, false);
function onChange(event) {
    let varr = event.target.files[0].name;
    document.getElementById("hijos").value = varr;
}


function actualizarNombre() {
    const nombreAlumno = localStorage.getItem('nombrealumno');
    const nombreAlumnoElement = document.getElementById('nombrealumno');
    nombreAlumnoElement.textContent = nombreAlumno;
}


function refrescarGrafo() {
    let url = 'https://quickchart.io/graphviz?graph=';
    let body = grafo.grafica()
    $("#image").attr("src", url + body);
    document.getElementById("padre").value = ""
    document.getElementById("hijos").value = ""
    localStorage.setItem("grafo", body);
}