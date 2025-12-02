/* ------------------------ VARIABLES GLOBALES ------------------------ */
const elementoCarton = document.getElementById("carton");
const elementoBola = document.getElementById("bola");
const elementoBtnBingo = document.getElementById("btnBingo");
const elementoMsgBingo = document.getElementById("bingoMsg");
const elementoCuadroNumeros = document.getElementById("cuadroNumeros"); // Nuevo contenedor para la tabla 1-75

let numerosSalidos = [];
let numerosDisponibles = Array.from({length: 75}, (_, number1) => number1 + 1);
let intervaloBolas;

/* ------------------------ FUNCIÓN GENERAR CARTÓN ------------------------ */
function generarColumna(rangoInicio) {
    let arrayNumeros = [];
    while(arrayNumeros.length < 5) {
        let numeroAleatorio = Math.floor(Math.random() * 15) + rangoInicio;
        if(!arrayNumeros.includes(numeroAleatorio)) arrayNumeros.push(numeroAleatorio);
    }
    return arrayNumeros.sort((parametro1, parametro2) => parametro1 - parametro2);
}

function inicializarCarton() {
    let colB = generarColumna(1);
    let colI = generarColumna(16);
    let colN = generarColumna(31);
    let colG = generarColumna(46);
    let colO = generarColumna(61);
    
    let columnasOrdenadas = [];
    const NUMERO_FILAS = 5;
    for(let numberfila=0; numberfila < NUMERO_FILAS; numberfila++) {
        columnasOrdenadas.push(colB[numberfila], colI[numberfila], colN[numberfila], colG[numberfila], colO[numberfila]);
    }

    const TOTAL_CELDAS = 25;
    for (let numbercell = 0; numbercell < TOTAL_CELDAS; numbercell++) {
        let celda = document.createElement("div");
        celda.classList.add("cell");

        if (numbercell === 12) {
            celda.classList.add("estrella", "marcada");
            celda.textContent = "";
        } else {
            celda.textContent = columnasOrdenadas[numbercell];
            celda.dataset.num = columnasOrdenadas[numbercell];

            celda.onclick = function () {
                if (numerosSalidos.includes(Number(celda.dataset.num))) {
                    celda.classList.toggle("marcada");
                } else {
                    alert("¡Ese número no ha salido todavía!");
                }
            };
        }
        elementoCarton.appendChild(celda);
    }
}

/* ------------------------ FUNCIÓN GENERAR CUADRO POR COLUMNAS (TABLA DERECHA) ------------------------ */
function generarCuadroNumeros() {
    // Definimos los rangos de cada letra para crear las columnas verticales
    const rangos = [
        { letra: 'B', min: 1, max: 15, clase: 'celdaB' },
        { letra: 'I', min: 16, max: 30, clase: 'celdaI' },
        { letra: 'N', min: 31, max: 45, clase: 'celdaN' },
        { letra: 'G', min: 46, max: 60, clase: 'celdaG' },
        { letra: 'O', min: 61, max: 75, clase: 'celdaO' }
    ];

    rangos.forEach(rango => {
        // 1. Crear un contenedor vertical para esta letra
        let columnaDiv = document.createElement("div");
        columnaDiv.classList.add("columna-vertical");

        // 2. Llenar ese contenedor con los números de su rango
        for (let numbercolum = rango.min; numbercolum <= rango.max; numbercolum++) {
            let celda = document.createElement("div");
            celda.classList.add("celdaSalida");
            celda.classList.add(rango.clase); // Clase de color (celdaB, celdaI...)
            celda.textContent = numbercolum;
            celda.id = `celda-${numbercolum}`; // ID único para encontrarla luego
            columnaDiv.appendChild(celda);
        }

        // 3. Agregar la columna completa al cuadro principal
        elementoCuadroNumeros.appendChild(columnaDiv);
    });
}

/* ------------------------ FUNCIÓN CANTAR BINGO (Solo Columna Vertical) ------------------------ */
window.cantarBingo = function () {
    const elementosCelda = document.querySelectorAll(".cell");
    let gano = false;
    const TAMANO_MATRIZ = 5; // 5x5

    // Verificar ÚNICAMENTE Columnas (vertical)
    // Recorremos cada columna (0 a 4)
    for (let indiceColumna = 0; indiceColumna < TAMANO_MATRIZ; indiceColumna++) {
        let contadorCelda = 0;
        
        // Para la columna actual, revisamos sus 5 filas hacia abajo
        for (let indiceFila = 0; indiceFila < TAMANO_MATRIZ; indiceFila++) {
            // Fórmula para obtener el índice lineal en el array de celdas:
            const indiceAbsoluto = indiceFila * TAMANO_MATRIZ + indiceColumna;
            
            if (elementosCelda[indiceAbsoluto].classList.contains("marcada")) {
                contadorCelda++;
            }
        }
        
        // Si las 5 celdas de esta columna están marcadas...
        if (contadorCelda === TAMANO_MATRIZ) {
            gano = true;
            // Resaltar la columna ganadora visualmente
            for (let k = 0; k < TAMANO_MATRIZ; k++) {
                 const indiceCeldaGanadora = k * TAMANO_MATRIZ + indiceColumna;
                 elementosCelda[indiceCeldaGanadora].classList.add("lineaGanadora");
            }
            break; // Salimos del bucle porque ya ganó
        }
    }

    if (gano) {
        elementoMsgbingo.style.display = "block";
        elementoMsgbingo.innerHTML = "¡¡BINGO!! <br><span style='font-size:20px'>¡Columna completada!</span>";
        elementoBtnBingo.style.display = "none";
        clearInterval(intervaloBolas);
    }
}

/* ------------------------ BOLAS RODANDO CON COLOR ------------------------ */
function obtenerColorBola(numeroBola) {
    if (numeroBola <= 15) {
        return "radial-gradient(circle at 30% 30%, #ffee58, #f4b400)"; 
    } else if (numeroBola <= 30) {
        return "radial-gradient(circle at 30% 30%, #ffc107, #e65100)"; 
    } else if (numeroBola <= 45) {
        return "radial-gradient(circle at 30% 30%, #81c784, #2e7d32)"; 
    } else if (numeroBola <= 60) {
        return "radial-gradient(circle at 30% 30%, #81d4fa, #0277bd)"; 
    } else {
        return "radial-gradient(circle at 30% 30%, #e0b0ff, #880e4f)"; 
    }
}

function lanzarBola() {
    if (numerosDisponibles.length === 0) return;

    let numeroSacado = numerosDisponibles.splice(Math.floor(Math.random()*numerosDisponibles.length),1)[0];
    numerosSalidos.push(numeroSacado);

    // 1. Actualizar la Bola rodando
    elementoBola.textContent = numeroSacado;
    elementoBola.style.background = obtenerColorBola(numeroSacado);

    // 2. Marcar el número en el cuadro derecho (Tabla 1-75)
    const celdaSalida = document.querySelector(`#celda-${numeroSacado}`);
    if (celdaSalida) {
        celdaSalida.classList.add("salido");
    }

    // Animación de entrada
    elementoBola.style.left = "-200px";
    setTimeout(()=>{ elementoBola.style.left = "200px"; }, 50);
}

/* ------------------------ INICIALIZACIÓN ------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarton();
    generarCuadroNumeros(); // Genera la tabla de la derecha
    lanzarBola();
    intervaloBolas = setInterval(lanzarBola, 8000); 
});