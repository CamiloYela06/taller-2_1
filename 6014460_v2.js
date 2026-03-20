const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const escala = 20; // 1 unidad cartesiana = 20 pixeles

const size = 4;

/* ================= UTILIDADES ================= */

// Obtener número desde input
function getInput(id) {
    return Number(document.getElementById(id).value);
}

// Crear punto
function crearPunto(x, y) {
    return { x, y };
}

/*
Dibuja un punto en el canvas.
ctx = contexto del canvas
x,y = coordenadas
size = tamaño del punto
*/
function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
}


/*
Convierte coordenadas del plano cartesiano
a coordenadas del canvas.

El canvas tiene su origen arriba izquierda,
por lo que debemos invertir el eje Y.
*/
function cartesianToCanvas(x, y) {

    return {
        x: x * escala,
        y: canvas.height - (y * escala)
    };

}


/*
Función que decide qué algoritmo usar
para dibujar la línea.
*/
function drawLine(x1, y1, x2, y2, size, method) {

    if (method === "dda") {
        drawDDA(x1, y1, x2, y2, size);
    }

    if (method === "bresenham") {
        drawBresenham(x1, y1, x2, y2, size);
    }

}


/*
Algoritmo DDA (Digital Differential Analyzer)

Idea principal:
calcular pequeños incrementos en X e Y
usando números decimales para aproximar
la línea ideal.
*/
function drawDDA(x1, y1, x2, y2, size) {

    let dx = x2 - x1;
    let dy = y2 - y1;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xInc = dx / steps;
    let yInc = dy / steps;

    let x = x1;
    let y = y1;

    for (let i = 0; i <= steps; i++) {

        drawPoint(ctx, Math.round(x), Math.round(y), size);

        x += xInc;
        y += yInc;

    }

}


/*
Algoritmo de Bresenham

Este algoritmo utiliza únicamente
operaciones enteras para determinar
qué pixel es el más cercano a la línea,
lo que lo hace más eficiente.
*/
function drawBresenham(x1, y1, x2, y2, size) {

    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);

    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;

    let err = dx - dy;

    while (true) {

        drawPoint(ctx, x1, y1, size);

        if (x1 === x2 && y1 === y2) break;

        let e2 = 2 * err;

        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }

        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }

    }

}


/*
Dibuja la cuadrícula del plano
y agrega numeración a los ejes.
*/
function drawGrid() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#ccc";

    for (let i = 0; i <= canvas.width; i += escala) {

        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();

        // Numeración real (no pixeles)
        ctx.fillStyle = "black";

        let valor = i / escala;

        ctx.fillText(valor, i, canvas.height - 5);
        ctx.fillText(valor, 5, canvas.height - i);
    }
}


/*
Verifica si tres puntos forman un triángulo.

Si el área del triángulo es 0,
los puntos están en la misma línea
(colineales).
*/
function esTriangulo(x1, y1, x2, y2, x3, y3) {

    let area =
        x1 * (y2 - y3) +
        x2 * (y3 - y1) +
        x3 * (y1 - y2);

    return area !== 0;

}


/*
Función principal del programa.

1. Lee los datos del usuario
2. Convierte coordenadas
3. Dibuja puntos
4. Verifica si hay triángulo
5. Dibuja las líneas usando el algoritmo elegido
*/
function procesar(method) {

    drawGrid();

    let x1 = Number(document.getElementById("x1").value);
    let y1 = Number(document.getElementById("y1").value);

    let x2 = Number(document.getElementById("x2").value);
    let y2 = Number(document.getElementById("y2").value);

    let x3 = Number(document.getElementById("x3").value);
    let y3 = Number(document.getElementById("y3").value);

    let p1 = cartesianToCanvas(x1, y1);
    let p2 = cartesianToCanvas(x2, y2);
    let p3 = cartesianToCanvas(x3, y3);

    drawPoint(ctx, p1.x, p1.y, 6);
    drawPoint(ctx, p2.x, p2.y, 6);
    drawPoint(ctx, p3.x, p3.y, 6);

    if (esTriangulo(x1, y1, x2, y2, x3, y3)) {

        document.getElementById("resultado").innerText =
            "Los puntos SI forman un triángulo";

        drawLine(p1.x, p1.y, p2.x, p2.y, size, method);
        drawLine(p2.x, p2.y, p3.x, p3.y, size, method);
        drawLine(p3.x, p3.y, p1.x, p1.y, size, method);

    }
    else {

        document.getElementById("resultado").innerText =
            "Los puntos NO forman un triángulo";

    }

}


drawGrid();