/* ------------------------ VARIABLES GLOBALES ------------------------ */
const elementoCarton = document.getElementById("carton");
const elementoBola = document.getElementById("bola");
const elementoBtnBingo = document.getElementById("btnBingo");
const elementoMsgBingo = document.getElementById("bingoMsg");
const elementoCuadroNumeros = document.getElementById("cuadroNumeros");

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
    const rangos = [
        { letra: 'B', min: 1, max: 15, clase: 'celdaB' },
        { letra: 'I', min: 16, max: 30, clase: 'celdaI' },
        { letra: 'N', min: 31, max: 45, clase: 'celdaN' },
        { letra: 'G', min: 46, max: 60, clase: 'celdaG' },
        { letra: 'O', min: 61, max: 75, clase: 'celdaO' }
    ];

    rangos.forEach(rango => {
        let columnaDiv = document.createElement("div");
        columnaDiv.classList.add("columna-vertical");

        for (let numbercolum = rango.min; numbercolum <= rango.max; numbercolum++) {
            let celda = document.createElement("div");
            celda.classList.add("celdaSalida");
            celda.classList.add(rango.clase);
            celda.textContent = numbercolum;
            celda.id = `celda-${numbercolum}`;
            columnaDiv.appendChild(celda);
        }
        elementoCuadroNumeros.appendChild(columnaDiv);
    });
}

/* ------------------------ FUNCIÓN CANTAR BINGO (Línea Horizontal) ------------------------ */
window.cantarBingo = function () {
    const elementosCelda = document.querySelectorAll(".cell");
    let gano = false;
    const TAMANO_MATRIZ = 5;

    // Verificar ÚNICAMENTE Filas (horizontal)
    for (let indiceFila = 0; indiceFila < TAMANO_MATRIZ; indiceFila++) {
        let contadorFila = 0;
        
        // Revisar las 5 columnas de esta fila
        for (let indiceColumna = 0; indiceColumna < TAMANO_MATRIZ; indiceColumna++) {
            const indiceAbsoluto = indiceFila * TAMANO_MATRIZ + indiceColumna;
            if (elementosCelda[indiceAbsoluto].classList.contains("marcada")) {
                contadorFila++;
            }
        }
        
        if (contadorFila === TAMANO_MATRIZ) {
            gano = true;
            // Resaltar la fila ganadora
            for (let numbermatriz = 0; numbermatriz < TAMANO_MATRIZ; numbermatriz++) {
                 const indiceCeldaGanadora = indiceFila * TAMANO_MATRIZ + numbermatriz;
                 elementosCelda[indiceCeldaGanadora].classList.add("lineaGanadora");
            }
            break; 
        }
    }

    if (gano) {
        elementoMsgbingo.style.display = "block";
        elementoMsgbingo.innerHTML = "¡¡BINGO!! <br><span style='font-size:20px'>¡Línea horizontal completada!</span>";
        elementobtnBingo.style.display = "none";
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

    elementoBola.textContent = numeroSacado;
    elementoBola.style.background = obtenerColorBola(numeroSacado);

    const celdaSalida = document.querySelector(`#celda-${numeroSacado}`);
    if (celdaSalida) {
        celdaSalida.classList.add("salido");
    }

    elementoBola.style.left = "-200px";
    setTimeout(()=>{ elementoBola.style.left = "200px"; }, 50);
}

/* ------------------------ INICIALIZACIÓN ------------------------ */
document.addEventListener('DOMContentLoaded', () => {
    inicializarCarton();
    generarCuadroNumeros();
    lanzarBola();
    intervaloBolas = setInterval(lanzarBola, 8000); 
});
    // ejemplos básicos de interacción
    document.querySelectorAll('.level-card').forEach(card => {
card.addEventListener('click', () => {
        if (card.classList.contains('locked')) {
        const info = card.dataset.unlock || 'Bloqueado';
    alert('Nivel bloqueado: ' + info);
        } else {
        alert('Entrando al nivel: ' + card.querySelector('.label').innerText);
        }
});
    });

    document.querySelector('.nav.next').addEventListener('click', () => {
alert('Siguiente página de niveles');
    });

    document.querySelectorAll('.action').forEach(parametrosaction => {
    parametrosaction.addEventListener('click', () => {
        alert('Acción: ' + (parametrosaction.querySelector('.mini')?.innerText || parametrosaction.className));
    });
    });
