import { isOneOf } from './isOneOf';

const memoryErrors = [
    'out of memory',
    'not enough storage',
    'not enough memory resources',
    'espacio de almacenamiento insuficiente',
    'insuffisante pour cette',
    'no hay suficiente espacio de pila',
    'espace pile insuffisant',
    'Memoria esaurita',
    'Mémoire insuffisante',
    'Memoria insuficiente',
    'Memória insuficiente',
];

export function isMemoryError(message: string | undefined): boolean {
    return isOneOf(memoryErrors, message);
}
