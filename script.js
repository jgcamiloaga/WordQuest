document.addEventListener("DOMContentLoaded", async () => {
    const palabras = await obtenerPalabras();
    const palabraSeleccionada = palabras[Math.floor(Math.random() * palabras.length)].toUpperCase();
    const longitudPalabra = palabraSeleccionada.length;
    const letterBoxes = document.getElementById('letter-boxes');
    const estadoJuego = document.getElementById('estado-juego');
    const inputLetra = document.getElementById('input-letra');
    const botonVerificar = document.getElementById('verificar');
    const playerHistory = document.getElementById('player-history');

    // Crear los cuadros para las letras
    for (let i = 0; i < longitudPalabra; i++) {
        const letterBox = document.createElement('div');
        letterBox.classList.add('letter-box');
        letterBox.setAttribute('id', `box-${i}`);
        letterBoxes.appendChild(letterBox);
    }

    // Función para obtener palabras desde el JSON
    async function obtenerPalabras() {
        const response = await fetch('palabras.json');
        return await response.json();
    }

    // Función para verificar la letra
    botonVerificar.addEventListener('click', () => {
        const letraIngresada = inputLetra.value.toUpperCase();
        inputLetra.value = '';
        if (letraIngresada.length !== longitudPalabra) {
            alert(`Por favor, ingresa una palabra de ${longitudPalabra} letras.`);
            return;
        }
        verificarPalabra(letraIngresada);
    });

    // Función para mostrar el intento en el historial
    function mostrarIntento(letra, colores) {
        const intentoContainer = document.createElement('div');
        intentoContainer.classList.add('letter-boxes');
        
        for (let i = 0; i < letra.length; i++) {
            const box = document.createElement('div');
            box.classList.add('letter-box');
            box.innerText = letra[i]; // Muestra la letra ingresada en el cuadro
            box.style.backgroundColor = colores[i]; // Aplica el color correspondiente
            intentoContainer.appendChild(box);
        }

        playerHistory.appendChild(intentoContainer);
    }

    // Función para verificar la palabra
    function verificarPalabra(letra) {
        const colores = new Array(longitudPalabra).fill(''); // Inicializa un array de colores
        const letrasContadas = {}; // Objeto para contar letras en la palabra seleccionada

        // Contamos las letras de la palabra seleccionada
        for (const char of palabraSeleccionada) {
            letrasContadas[char] = (letrasContadas[char] || 0) + 1;
        }

        // Primero verificamos las letras en la posición correcta
        for (let i = 0; i < longitudPalabra; i++) {
            const box = document.getElementById(`box-${i}`);
            box.innerText = letra[i]; // Muestra la letra ingresada en el cuadro
            
            if (letra[i] === palabraSeleccionada[i]) {
                box.style.backgroundColor = 'green'; // Correcto y en la posición correcta
                colores[i] = 'green'; // Guarda el color para el historial
                letrasContadas[letra[i]]--; // Reducimos la cuenta de letras
            }
        }

        // Luego verificamos las letras que están en la palabra pero en posición incorrecta
        for (let i = 0; i < longitudPalabra; i++) {
            const box = document.getElementById(`box-${i}`);
            
            if (colores[i] !== 'green' && palabraSeleccionada.includes(letra[i]) && letrasContadas[letra[i]] > 0) {
                box.style.backgroundColor = 'orange'; // Letra en la palabra pero en posición incorrecta
                colores[i] = 'orange'; // Guarda el color para el historial
                letrasContadas[letra[i]]--; // Reducimos la cuenta de letras
            }
        }
        
        mostrarIntento(letra, colores); // Muestra el intento con los colores
        estadoJuego.innerText = "Adivina la siguiente palabra!";
    }
});