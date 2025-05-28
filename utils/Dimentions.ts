import { ICartProduct } from "@/interfaces";

// Primero, compactamos cada tipo de producto
function calcularBloqueProducto(
    width: number,
    length: number,
    height: number,
    weight: number,
    quantity: number
) {
    let best = {
        width: 0,
        length: 0,
        height: 0,
        volume: Infinity,
        weight: weight * quantity
    };

    for (let cols = 1; cols <= quantity; cols++) {
        for (let rows = 1; rows <= Math.ceil(quantity / cols); rows++) {
            const layers = Math.ceil(quantity / (cols * rows));
            const w = width * cols;
            const l = length * rows;
            const h = height * layers;
            const volume = w * l * h;

            if (volume < best.volume) {
                best = { width: w, length: l, height: h, volume, weight: weight * quantity };
            }
        }
    }

    return {
        width: best.width,
        length: best.length,
        height: best.height,
        weight: best.weight
    };
}

// Luego, agrupamos esos bloques en una "rejilla"
export const calcularPaquete = (cart: ICartProduct[]) => {
    const bloques: { width: number; length: number; height: number; weight: number }[] = [];
    let totalWeight = 0;

    cart.forEach(product => {
        const quantity = Number(product.quantity);
        const { width, length, height, weight } = product.dimentions;

        const bloque = calcularBloqueProducto(
            Number(width),
            Number(length),
            Number(height),
            Number(weight),
            quantity
        );

        totalWeight += bloque.weight;
        bloques.push(bloque);
    });

    // Ordenamos los bloques por altura descendente para acomodar mejor en capas
    bloques.sort((a, b) => b.height - a.height);

    const maxRowWidth = 60; // tamaño máximo de ancho por fila (puede ajustarse)
    const filas: { width: number; length: number; height: number }[] = [];
    let filaActual: { width: number; length: number; height: number } = {
        width: 0,
        length: 0,
        height: 0
    };

    for (const bloque of bloques) {
        if (filaActual.width + bloque.width <= maxRowWidth) {
            filaActual.width += bloque.width;
            filaActual.length = Math.max(filaActual.length, bloque.length);
            filaActual.height = Math.max(filaActual.height, bloque.height);
        } else {
            filas.push(filaActual);
            filaActual = {
                width: bloque.width,
                length: bloque.length,
                height: bloque.height
            };
        }
    }
    // Agregar última fila
    if (filaActual.width > 0) {
        filas.push(filaActual);
    }

    // Dimensiones finales
    const finalWidth = Math.max(...filas.map(f => f.width));
    const finalLength = Math.max(...filas.map(f => f.length));
    const finalHeight = filas.reduce((sum, f) => sum + f.height, 0);

    return {
        weight: totalWeight.toFixed(2),
        width: finalWidth.toString(),
        length: finalLength.toString(),
        height: finalHeight.toString()
    };
};