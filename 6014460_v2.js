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

/* ================= DIBUJO ================= */

//Dibuja un punto en el canvas.
function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
}

//Convierte coordenadas del plano cartesianoa coordenadas del canvas.
function cartesianToCanvas(x, y) {

    return {
        x: p.x * escala,
        y: canvas.height - (p.y * escala)
    };

}



//Función que decide qué algoritmo usar para dibujar la línea.
function drawLine(p1, p2, method) {

    if (method === "dda") return drawDDA(p1, p2);
    return drawBresenham(p1, p2);
}


/* ===== DDA ===== */
function drawDDA(p1, p2) {

    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;

    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xInc = dx / steps;
    let yInc = dy / steps;

    let x = p1.x;
    let y = p1.y;

    for (let i = 0; i <= steps; i++) {
        drawPoint(ctx, Math.round(x), Math.round(y), size);
        x += xInc;
        y += yInc;
    }
}


/* ===== Bresenham ===== */
function drawBresenham(p1, p2) {

    let x1 = p1.x, y1 = p1.y;
    let x2 = p2.x, y2 = p2.y;

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

/* ================= GRID ================= */

//Dibuja la cuadrícula del plano y agrega numeración a los ejes.
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

/* ================= LÓGICA ================= */
//Verifica si tres puntos forman un triángulo.si el área del triángulo es 0,los puntos están en la misma línea

function esTriangulo(p1, p2, p3) {

    let area =
        p1.x * (p2.y - p3.y) +
        p2.x * (p3.y - p1.y) +
        p3.x * (p1.y - p2.y);

    return area !== 0;
}
/* ================= MAIN ================= */
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

    // Leer puntos
    let puntos = [
        crearPunto(getInput("x1"), getInput("y1")),
        crearPunto(getInput("x2"), getInput("y2")),
        crearPunto(getInput("x3"), getInput("y3"))
    ];

    // Convertir a canvas
    let puntosCanvas = puntos.map(cartesianToCanvas);

    // Dibujar puntos
    puntosCanvas.forEach(p => drawPoint(ctx, p.x, p.y, 6));

    if (esTriangulo(...puntos)) {

        document.getElementById("resultado").innerText =
            "SI forman un triángulo";

        // Dibujar lados con loop
        for (let i = 0; i < 3; i++) {
            let p1 = puntosCanvas[i];
            let p2 = puntosCanvas[(i + 1) % 3];
            drawLine(p1, p2, method);
        }

    } else {

        document.getElementById("resultado").innerText =
            "NO forman un triángulo";
    }
}

drawGrid();