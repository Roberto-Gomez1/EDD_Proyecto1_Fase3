import {Alumno} from './Objeto.js';

class login{
    constructor(){
        this.user = document.getElementById('user');
        this.passw = document.getElementById('contra');
        this.btn = document.getElementById('btn');
        this.btn.addEventListener('click', this.validar.bind(this));
    }
    validar() {
      if(this.user.value === 'admin' && this.passw.value === 'admin'){
        window.location = 'dashboard.html';
      }
        const data = JSON.parse(localStorage.getItem("alumnos"));
        if (!data) {
          alert('No hay datos guardados en el localStorage');
          return;
        }
        console.log(JSON.stringify(data));
        const alumno = data.find((alumno) => alumno.carnet === parseInt(this.user.value) && alumno.contraseña === this.passw.value);
        if(alumno){
          localStorage.setItem("nombrealumno", JSON.stringify(this.user.value));
          window.location = 'dashboardestudiante.html';
        }else{
          alert('Usuario o contraseña incorrectos');
        }
      }
      
}    

const loginObj = new login();
