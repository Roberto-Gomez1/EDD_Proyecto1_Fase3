class nodoArbol{
    constructor(valor, id){
        this.siguiente = null;
        this.valor = valor;
        this.primero = null;
        this.id = id;
    }
}

class ArbolNArio{
    constructor(){
        this.raiz = new nodoArbol("/", 0)
        this.nodo_creados = 1;
    }

    BuscarCarpeta(carpeta_nueva, lista_carpeta){
        //Si la nueva carpeta se creara en la raiz, se buscara si existe o no
        if(lista_carpeta[1] === "" && this.raiz.primero !== null){
            let aux = this.raiz.primero
            while(aux){
                if(aux.valor === carpeta_nueva){
                    return 1
                }
                aux = aux.siguiente
            }
            return 2
        }
        //Si la nueva carpeta se creara en la raiz pero no existe ninguna carpeta
        else if (lista_carpeta[1] === "" && this.raiz.primero === null){
            return 5
        }
        //Si la nueva carpeta se creara en algun directorio pero la raiz no posee ninguna carpeta
        else if(lista_carpeta[1] !== "" && this.raiz.primero === null){
            return 3
        }
        //Buscamos el directorio padre y revisar si en sus hijos existe la carpeta
        else if(lista_carpeta[1] !== "" && this.raiz.primero !== null){
            let aux = this.raiz.primero
            let nivel = lista_carpeta.length
            let posicion = 1; 
            for(var i = 1; i < nivel; i++){
                if(aux !== null){
                    while(aux){
                        if(posicion < lista_carpeta.length && lista_carpeta[posicion] === aux.valor){
                            posicion++
                            if(aux.primero !== null && posicion < lista_carpeta.length){
                                aux = aux.primero
                            }
                            break;
                        }else{
                            aux = aux.siguiente
                        }
                    }
                }else{
                    break;
                }
            }
            if(aux !== null){
                aux = aux.primero
                while(aux){
                    if(aux.valor === carpeta_nueva){
                        return 1
                    }
                    aux = aux.siguiente
                }
                return 2
            }else{
                return 4
            }

        }
    }
    //Funcion solo para ordenar la lista de hijos cuando el padre posee varios hijos
    insertarOrdenado(raiz, nuevoNodo){
        let piv = raiz.primero
        if(nuevoNodo.valor < raiz.primero.valor){
            nuevoNodo.siguiente = raiz.primero
            raiz.primero = nuevoNodo
            return raiz
        }else{
            while(piv.siguiente){
                if( nuevoNodo.valor > piv.valor && nuevoNodo.valor < piv.siguiente.valor){
                    nuevoNodo.siguiente = piv.siguiente
                    piv.siguiente = nuevoNodo
                    return raiz
                }else if(nuevoNodo.valor < piv.valor){
                    nuevoNodo.siguiente = piv
                    piv =  nuevoNodo
                    return raiz
                }else{
                    piv = piv.siguiente
                }
            }
            piv.siguiente = nuevoNodo
            return raiz
        }
    }
    // /usac/prueba -> prueba1 /usac/prueba(prueba1)
    insertarHijos(carpeta_nueva, lista_carpeta){
        /**
         * creamos el nuevo nodo y aumentamos la cantidad de nodos creados
         */
        const nuevoNodo = new nodoArbol(carpeta_nueva, this.nodo_creados)
        this.nodo_creados++
        //Corroboramos si la insercion es en la raiz y si la raiz no tiene ninguna carpeta
        if(lista_carpeta[1] === "" && this.raiz.primero === null){
            this.raiz.primero = nuevoNodo
        }
        //Corroboramos si la insercion es en la raiz y pero la raiz ya tiene carpetas
        else if(lista_carpeta[1] === "" && this.raiz.primero !== null){
            this.raiz = this.insertarOrdenado(this.raiz, nuevoNodo)
        }
        //Corroboramos si la insercion es en algun directorio que no es la raiz
        else if(lista_carpeta[1] !== "" && this.raiz.primero !== null){
            let aux = this.raiz.primero
            let nivel = lista_carpeta.length
            let posicion = 1; 
            //Recorremos hasta llegar a la profundidad maxima donde se quiere insertar la nueva carpeta
            for(var i = 1; i < nivel; i++){
                if(aux !== null){
                    while(aux){
                        //Comparamos si las posiciones de la lista de carpetas es igual a la del nodo actual sino seguimos buscando
                        if(posicion < lista_carpeta.length && lista_carpeta[posicion] === aux.valor){ 
                            posicion++
                            //Esta comparacion es para asegurarnos que nos quedaremos en el nodo padre
                            if(aux.primero !== null && posicion < lista_carpeta.length){
                                aux = aux.primero
                            }
                            break;
                        }else{
                            aux = aux.siguiente
                        }
                    }
                }else{
                    break;
                }
            }
            //Si la carpeta padre ya tiene carpetas se agrega en el primero sino se manda a insertar en el orden correcto
            if(aux.primero === null){
                aux.primero = nuevoNodo
            }else{
                aux = this.insertarOrdenado(aux, nuevoNodo)
            }
        }
    }
    /**
     * 1 - Carpeta ya existe
     * 2 - la carpeta no existe
     * 3 - El directorio no es correcto o no es valido
     * 4 - Directorio no valido
     * 5 - No existe ninguna carpeta en la raiz
     * 
     */
    insertarValor(ruta, carpeta_nueva){
        let lista_carpeta = ruta.split('/')
        let existe_carpeta = this.BuscarCarpeta(carpeta_nueva, lista_carpeta)
        switch(existe_carpeta){
            case 1:
                alert("La carpeta ya existe")
                break;
            case 2:
                this.insertarHijos(carpeta_nueva, lista_carpeta)
                break;
            case 3:
                alert("La ruta actual no existe")
                break;
            case 4:
                alert("La ruta actual no es valida")
                break;
            case 5:
                this.insertarHijos(carpeta_nueva, lista_carpeta)
                break;
        }
    }

    grafica_arbol(){
        var cadena = "";
        if(!(this.raiz === null)){
            cadena = "digraph arbol{ ";
            cadena = cadena + this.retornarValoresArbol(this.raiz);
            cadena = cadena + "}";
        }else{
            cadena = "digraph G { arbol }";
        }
        return cadena;
    }

    /** le mando el parametro primero y solo recorre los siguientes*/
    retornarValoresArbol(raiz){
        var cadena = "node[shape=record] ";
        let nodo = 1;
        let nodo_padre = 0;
        cadena += "nodo" + nodo_padre + "[label=\"" + this.raiz.valor  + "\"] "
        cadena += this.valoresSiguietes(this.raiz.primero, nodo, nodo_padre)
        cadena += this.conexionRamas(this.raiz.primero, 0)
        return cadena;
    }


    valoresSiguietes(raiz, nodo, nodo_padre){
        let cadena = ""
        let aux = raiz
        let nodo_padre_aumento = nodo_padre
        if(aux !== null){
            while(aux){
                cadena += "nodo" + aux.id + "[label=\"" + aux.valor  + "\"] "
                aux = aux.siguiente
            }
            aux = raiz
            while(aux){
                nodo_padre_aumento++
                cadena += this.valoresSiguietes(aux.primero, this.nodo_creados, nodo_padre_aumento)
                aux = aux.siguiente
            }
        }
        return cadena
    }

    conexionRamas(raiz, padre){
        let cadena = ""
        let aux = raiz
        if(aux !== null){
            while(aux){
                cadena += "nodo" + padre + " -> nodo" + aux.id + " "
                aux = aux.siguiente
            }
            aux = raiz
            while(aux){
                cadena += this.conexionRamas(aux.primero, aux.id)
                aux = aux.siguiente
            }
        }
        return cadena
    }

    /** Modificacion 30/03/2023 */
    BuscarCarpetaV2(lista_carpeta){
        //Directorio Actual seria la Raiz
        if(lista_carpeta[1] === "" && this.raiz.primero !== null){
            return this.raiz
        }
        //Directorio Actual seria Raiz pero no contiene elementos
        else if (lista_carpeta[1] === "" && this.raiz.primero === null){
            return null
        }
        //Actual no es raiz pero tampoco hay elementos en raiz
        else if(lista_carpeta[1] !== "" && this.raiz.primero === null){
            return null
        }
        //Buscamos el directorio padre y revisar si en sus hijos existe la carpeta
        else if(lista_carpeta[1] !== "" && this.raiz.primero !== null){
            let aux = this.raiz.primero
            let nivel = lista_carpeta.length
            let posicion = 1; 
            for(var i = 1; i < nivel; i++){
                if(aux !== null){
                    while(aux){
                        if(posicion < lista_carpeta.length && lista_carpeta[posicion] === aux.valor){
                            posicion++
                            if(aux.primero !== null && posicion < lista_carpeta.length){
                                aux = aux.primero
                            }
                            break;
                        }else{
                            aux = aux.siguiente
                        }
                    }
                }else{
                    break;
                }
            }
            if(aux !== null){
                return aux
            }else{
                return null
            }

        }
    }

    mostrarCarpetasActuales(ruta){
        let lista_carpeta = ruta.split('/')
        let existe_carpeta = this.BuscarCarpetaV2(lista_carpeta)
        try{
            if(existe_carpeta !== null){
                let aux = existe_carpeta.primero
                while(aux){
                    console.log(aux.valor)
                    aux = aux.siguiente
                }
            }
        }catch(error){
            console.log("Hubo un error")
        }
    }
}

const arbolnario = new ArbolNArio()
function agregarVarios(){
    let ruta = document.getElementById("ruta").value
    let carpeta = document.getElementById("carpeta").value
    try{
        arbolnario.insertarValor(ruta,carpeta)
    }catch(error){
        alert("Hubo un error al insertar el nodo")
    }
    document.getElementById("carpeta").value = "";
    refrescarArbol();  

}

function refrescarArbol(){
    let url = 'https://quickchart.io/graphviz?graph=';
    let body = arbolnario.grafica_arbol();
    $("#image").attr("src", url + body);
    document.getElementById("carpeta").value = "";
}

function mostraCarpetas(){
    let ruta = document.getElementById("ruta").value
    arbolnario.mostrarCarpetasActuales(ruta)
}