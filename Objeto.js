export { alumnos, Alumno }
class Alumno {
    constructor(nombre, carnet, contraseña, carpeta) {
        this.nombre = nombre;
        this.carnet = carnet;
        this.contraseña = contraseña;
        this.carpeta = carpeta;
    }
}


import { tablaHash } from "./Tabla.js";
let alumnos = [];
async function cargaAlumnos(e) {
    var archivo = e.target.files[0];

    if (!archivo) {
        return;
    }

    let lector = new FileReader();
    lector.onload = async function (e) {
        let contenido = e.target.result;

        const object = JSON.parse(contenido);

        alumnos = object.alumnos.map((alumno) => {
            return new Alumno(alumno.nombre, alumno.carnet, alumno.password, alumno.Carpeta_Raiz);
        });
        for (let i = 0; i < alumnos.length; i++) {
            let pass_en = await tablaHash.sha256(alumnos[i].contraseña)
            tablaHash.insertar(alumnos[i].carnet, alumnos[i].nombre, pass_en);
        }
        tablaHash.genera_tabla()
        localStorage.setItem("alumnos", JSON.stringify(alumnos));
    }
    lector.readAsText(archivo);
}


function agregarEventos() {
    document.getElementById("carga_alumnos").addEventListener("change", cargaAlumnos, false);
}



document.addEventListener("DOMContentLoaded", agregarEventos);


