const fs = require("fs");

/**FUNCIONES */
function leeArchivo(simbolos) {
    let archivo = process.argv[2];
    if (archivo != undefined && fs.existsSync(archivo)){
        let contenido = fs.readFileSync(archivo, 'ASCII');                  //leo todo el archivo
        let palabras = contenido.split(' ');                                //me quedo con las palabras

        
        palabras.forEach(palabra =>{
            for (var i of palabra)
                if (!simbolos.key.has(i))
                    simbolos.set(i, 1);                                     //agrego símbolo nuevo
                else
                    simbolos.value++;                                       //cuento símblo nuevo
        });
    }  

    fs.closeSync(archivo);
}

/* si process.argv[3] == c -> comprimo (hay que crear el archivo comprimido luego de crear el árbol de huffman)
   si process.argv[3] == d -> descomprimo (en base al árbol de huffman hay que crear el archivo descomprimido)

   dentro de leeArchivo() debería de analizar si comprimir o descomprimir?? VER EN DONDE HACERLO PARA QUE QUEDE LINDO!
 */

function suma(simbolos) {
    let aux = 0;
    simbolos.forEach((valor, clave) => {aux += valor;
    });

    return aux;
}


function ordenaSimbolos(simbolos) {
    var arrayAux = Array.from(simbolos);

    arrayAux.sort(function(a, b) {
        return b[1] - a[1];                                                 //ordeno los símbolos de forma decreciente
    });
    
    var simbolos = new Map(arrayAux);
    
}

function generaArbol(simbolos) {

}


/**PROGRAMA PRINCIPAL */
let simbolos = new Map;                                                         //simbolos emitidos por la fuente
let N;

/**
 * ver como generar el árbol
 * 
 * puntero izq, dato, puntero derecho???
 */

if (leeArchivo(simbolos)){

    N = suma(simbolos);
    for (var [i, j] of simbolos){
        simbolos.set(i, (j/N).toFixed(4));                                  //calculo la prob de cada símbolo
    }


    ordenaSimbolos(simbolos);
}



/** ----------------------------------------------------------------------- */
/**
 * huffman:
 * 1- ordenar la tabla de símbolos según su probabilidad: o sea que primero hay que recorrer todo el archivo, 
 *    calcular la prob de cada símbolo y luego ordenar la tabla en orden dereciente
 * 
 * 2- crear el árbol de huffman, cada hoja representa un símbolo y cada nodo es la suma de las frecuencias de sus hijos
 * 
 * 3- en base al árbol, generar los códigos desde la raíz hasta las hojas
 * 
 * 4- compresión: se reemplaza cada símbolo en los datos de entrada por su código correspondiente
 * 
 * 5- descompresión: se utiliza el árbol de huffman para traducir los cód binarios a símbolos, yendo de raíz a hoja.
 * 
 * 
 * Shannon-fano:
 * 1- ordenar la tabla de símbolos según su probabilidad: o sea que primero hay que recorrer todo el archivo, 
 *    calcular la prob de cada símbolo y luego ordenar la tabla en orden dereciente
 * 
 * 2- dividir la tabla en dos, equilibrando las frecuencias, hasta obtener grupos de un sólo símbolo
 * 
 * 3- a cada cód se le asignan los símbolos depediendo del grupo en el cual están. Grupos más arriba códigos más cortos
 * 
 * 4- compresión: se reemplaza cada símbolo de entrada por el cód correspondiente.
 * 
 * 5- descompresión: se utiliza el árbol de shannon-fano.
 */