const fs = require("fs");

/** FUNCIONES */

function leeArchivo(diccionario) {
    let aux = true;
    let archivo = process.argv[2];
    if (archivo != undefined && fs.existsSync(archivo)){
        let contenido = fs.readFileSync(archivo, 'ASCII');      //leo todo el archivo
        let palabras = contenido.split(' ');                    //me quedo con las palabras

        palabras.forEach(palabra =>{                            //por cada palabra del archivo la cargo al diccionario o la cuento
            if(diccionario.key.has(palabra))
                diccionario.value++;
            else{
                diccionario.set(palabra, 1);                    //agrego nueva palabra
            }
        });  
    } else
        aux = false;
    return aux;
};


function entropia(diccionario, total_simbolos) {
    let acumulador = 0;

    diccionario.forEach((key, value) => {
        let probabilidad = value / total_simbolos;
        acumulador += probabilidad * Math.log10(probabilidad);  //sera necesario calcular de base N?? VEEEEEEEEEEEEEER!!!
        /** cambiar base, a que sea base N, cantidad simbolos de la base */
    });

    return acumulador;
}

function longitudMedia() {
    
}

/** PROGRAMA PRINCIPAL */

let diccionario = new Map;                                      // key: palabra         value:  cant apariciones
let letras = [];                                                //letras del diccionario

if (leeArchivo(diccionario)) {
    let total_simbolos = diccionario.values.reduce(function (resultado, elemento) {
    return resultado + elemento;
    } , 0);                                                     //acumulo la aparicion de todas las palabras para obtener el total

    console.log("Entropia: ", entropia(diccionario, total_simbolos));


}
