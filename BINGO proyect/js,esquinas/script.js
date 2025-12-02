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

/* ------------------------ FUNCIÓN CANTAR BINGO (4 ESQUINAS) ------------------------ */
window.cantarBingo = function () {
    const elementosCelda = document.querySelectorAll(".cell");
    
    // Índices de las esquinas en una cuadrícula de 5x5 (0 a 24)
    // 0: Arriba Izq | 4: Arriba Der | 20: Abajo Izq | 24: Abajo Der
    const indicesEsquinas = [0, 4, 20, 24];
    let contador = 0;

    indicesEsquinas.forEach(indice => {
        if (elementosCelda[indice].classList.contains("marcada")) {
            contador++;
        }
    });

    // Si las 4 esquinas están marcadas, gana
    if (contador === 4) {
        // Resaltar las celdas ganadoras
        indicesEsquinas.forEach(indice => {
            elementosCelda[indice].classList.add("lineaGanadora");
        });

        elementoMsgBingo.style.display = "block";
        elementoMsgBingo.innerHTML = "¡¡BINGO!! <br><span style='font-size:20px'>¡4 Esquinas completadas!</span>";
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
});    /* ------------------------ js jugar con amigos ------------------------ */
        function mostrarInputUnirse() {
            const inputDiv = document.getElementById('inputUnirse');
            inputDiv.style.display = 'block';
        }

        function unirsePorCodigo() {
            const codigo = document.getElementById('codigoInput').value;
            if (codigo.length === 5 && !isNaN(codigo)) {
                // Aquí iría la lógica de verificación real con un servidor.
                alert(`Simulando conexión a la sala con código: ${codigo}`);
                
                // Si la conexión es exitosa, redirigir al juego:
                // window.location.href = 'aurabingo_index.html?codigo=' + codigo;

            } else {
                alert('Por favor, ingresa un código válido de 5 dígitos.');
            }
        }
            /* ------------------------ js crear sala ------------------------ */
                   // Lógica de la Sala de Espera
        const codigoSala = document.getElementById('codigoSala');
        const listaJugadores = document.getElementById('listaJugadores');
        const btnIniciarJuego = document.getElementById('btnIniciarJuego');

        // La lista solo tiene al anfitrión inicialmente
        let jugadores = [
            { nombre: 'Anfitrión (Tú)', id: 1 }
        ];
        
        // Función para simular la entrada de amigos (puedes llamarla desde la consola)
        window.simularEntradaDeAmigo = function() {
            const nuevoId = jugadores.length + 1;
            const nuevoNombre = `Amigo ${nuevoId}`;
            jugadores.push({ nombre: nuevoNombre, id: nuevoId });
            actualizarListaJugadores();
            console.log(`¡Jugador ${nuevoNombre} se ha unido!`);
        }


        // 1. Generar Código Aleatorio de 5 DÍGITOS
        function generarCodigo() {
            // Genera un número entre 10000 (inclusive) y 99999 (inclusive)
            return Math.floor(10000 + Math.random() * 90000); 
        }

        // 2. Actualizar la lista en el HTML
        function actualizarListaJugadores() {
            listaJugadores.innerHTML = '';
            jugadores.forEach(j => {
                const div = document.createElement('div');
                div.classList.add('jugadorItem');
                // Mostramos el nombre y el estado
                div.innerHTML = `<span>👤 ${j.nombre}</span><span>Listo</span>`; 
                listaJugadores.appendChild(div);
            });
            
            // Habilitar el botón de inicio si hay al menos 2 jugadores
            if (jugadores.length >= 2) {
                btnIniciarJuego.disabled = false;
                btnIniciarJuego.textContent = `Iniciar Juego con ${jugadores.length} jugadores`;
            } else {
                btnIniciarJuego.disabled = true;
                btnIniciarJuego.textContent = 'Esperando más jugadores...';
            }
        }

        // 3. Iniciar Juego (Redireccionar al juego real)
        btnIniciarJuego.addEventListener('click', () => {
            alert(`¡Juego iniciado! Jugadores: ${jugadores.length}`);
            window.location.href = 'aurabingo_index.html?modo=amigos&jugadores=' + jugadores.length;
        });

        // Inicializar la sala
        codigoSala.textContent = generarCodigo();
        actualizarListaJugadores();