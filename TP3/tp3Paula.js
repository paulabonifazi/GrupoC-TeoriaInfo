const fs = require("fs");

/**FUNCIONES */
function leeArchivo(simbolos) {
    let aux = true;
    let archivo = process.argv[2];
    if (archivo != undefined && fs.existsSync(archivo)){
        let contenido = fs.readFileSync(archivo, 'ASCII');      //leo todo el archivo
        let palabras = contenido.split(' ');                    //me quedo con las palabras

        

        palabras.forEach(palabra =>{
            for (var i of palabra)
                if (!simbolos.key.has(i))
                    simbolos.set(i, 1);                        //agrego símbolo nuevo
                else
                    simbolos.value++;                          //cuento símblo nuevo
        });

        for (var i of simbolos.values()){
            i = i/(simbolos.size);                            //calculo la probabilidad de cada símbolo
        }
    }  

    fs.closeSync(archivo);
}




/**PROGRAMA PRINCIPAL */
let simbolos = map;                    //simbolos emitidos por la fuente




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