const fs = require('fs');

main();

function main() {
    let setpar = new Map; //var esta deprecado, es mejor let!
    let vec = [];
    if (lectura_arch(setpar, vec)) {//lo que hago es guardar el diccionario y la cantidad de apariciones
        let suma = sumar(setpar);
        console.log('entropia:', enthropy(suma, vec, setpar));
        console.log('longitud media:', longitudMedia(suma, setpar));
        console.log('valor de kraft:', ecuacionKraft(vec, setpar));
        console.log("es compacto: ", iscompacto(suma, vec, setpar));
        if (ecuacionKraft(vec, setpar) <= 1)
            console.log("es instantaneo: ", isinstantaneo(setpar));
    }
}

function lectura_arch(setpar, vec) {
    let archivo = process.argv[2];
    if (archivo != undefined && fs.existsSync(archivo)) {
        let contenido = fs.readFileSync(archivo, 'ASCII');
        let palabras = contenido.split(' ');
       
        palabras.forEach(palabra => {
            if (setpar.has(palabra)) {
                const aux = setpar.get(palabra) + 1;
                setpar.set(palabra, aux);
            } else
                setpar.set(palabra, 1);            
        });
        // divir¿dir en dos la funcion, (modularidad), si no lee el archivo que retorne undefined y luego llamar a las otras funciones
        // analizar en base a dicho valor 

        //ver si hay funcion que me limpie lso repetidos!
        setpar.forEach((valor, clave) => {
            for (let i = 0; i < clave.length; i++) {
                letra = clave[i];
                if (!vec.includes(letra))
                    vec.push(letra);
            }
        });
        return true;
    } else
        return false;
}

function sumar(setpar) {
    let suma = 0;
    setpar.forEach((valor, clave) => { suma += valor; });
    return suma;
}

function enthropy(suma, vec, setpar) {
    let sum = 0;
    let cant = vec.length;
    setpar.forEach((valor, clave) => {
        sum += (valor / suma) * logaritmoBaseN(suma / valor, cant);
        /**ver funciones de reduce! o similares
         * para reducir un array entero a un valor, acumular, sumar, etc! y no tengo que hacer todo este choclo
         */
    });
    return sum;
}

function logaritmoBaseN(x, n) {
    if (x <= 0 || n <= 0) {
        throw new Exception("Los argumentos deben ser positivos.");
    }
    return Math.log(x) / Math.log(n);
}

function longitudMedia(suma, setpar) {
    let sum = 0;
    setpar.forEach((valor, clave) => {
        sum += (valor / suma) * clave.length;
    });
    return sum;
}

//analizar si está bien calculado, me hace ruido la potencia
function ecuacionKraft(vec, setpar) {
    let sum = 0;
    let cant = vec.length;
    setpar.forEach((valor, clave) => {
        sum += cant ** (-clave.length); 
    });
    return sum;
}

function iscompacto(suma, vec, setpar) {
    let r = vec.length;
    for (const [clave, valor] of setpar) {
        let val = Math.round(logaritmoBaseN(suma / valor, r));
        if (clave.length != val) {
            return false;
        }
    };
    return true;
}

//ver esos whiles!
function isinstantaneo(setpar) {
    let aux = new Array;
    let i = 0;
    setpar.forEach((valor, clave) => {
        aux[i] = clave;
        i++;
    });
    i = 0;
    let cond = false;
    while (i < aux.length && cond == false) {
        let j = 0;
        while (j < aux.length && cond == false) {
            if (j != i) {
                cond = aux[j].startsWith(aux[i]);
            }
            j++;
        }
        i++;
    }
    return !cond;
}

