import {Alumno} from './Objeto.js';

class login{
    constructor(){
        this.user = document.getElementById('user');
        this.passw = document.getElementById('contra');
        this.btn = document.getElementById('btn');
        this.btn.addEventListener('click', this.validar.bind(this));
    }
    validar(){
        const data = JSON.parse(localStorage.getItem("alumnos"));
        if (!Array.isArray(data) || data.length === 0) {
            alert('No hay usuarios registrados');
            return;
        }
        console.log(JSON.stringify(data));
        const alumno = data.find((alumno) => alumno.carnet === parseInt(this.user.value) && alumno.contraseña === this.passw.value);
        if(this.user.value === 'admin' && this.passw.value === 'admin'){
            window.location = 'dashboard.html';
        }else if(alumno){
            window.location = 'dashboardestudiante.html';
        }else{
            alert('Usuario o contraseña incorrectos');
        }
    }
    
}    

const loginObj = new login();
