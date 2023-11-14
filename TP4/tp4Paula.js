const fs = require("fs");
let N;                                                                      //cantidad de mjs
let M;                                                                      //longitud de mjs


/** FUNCIONES */
function leeArchivo(prob, canal) {
    let archivo = process.argv[2];
    N = process.argv[3];
    M = process.argv[4];

    console.log(N);
    console.log(M);


    try {
        let palabras = []
        let contenido = fs.readFileSync(archivo, 'ASCII');                  //leo todo el archivo
        let lineas = contenido.split('\n');                                 //me quedo con las palabras
        lineas.forEach(element => {
            element = element.replace('\r', '')
            palabras = palabras.concat(element.split(' '))
        });

        for (let k=0; k<palabras.length; k++) {
            switch (k) {
                case 0: prob[0] = palabras[k];
                    break;
                case 1: prob[1] = palabras[k];
                    break;
                case 2: canal[0][0] = palabras[k];
                    break;
                case 3: canal[0][1] = palabras[k];
                    break;
                case 4: canal[1][0] = palabras[k];
                    break;
                case 5: canal[1][1] = palabras[k];
                    break;            
            }
        }
      
    }
    catch (error){
        console.error("Error al leer el archivo", error);
    }
}



/** PROGRAMA PRINCIPAL */
let prob = [];                                                              //vector de probabildiades de la fuente
let canal = [[],[]];                                                        //matriz del canal

leeArchivo(prob, canal);

console.log(prob);
console.log(canal);
console.log(N);
console.log(M);