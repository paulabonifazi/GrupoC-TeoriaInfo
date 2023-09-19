const fs = require("fs");

/** FUNCIONES */

function lee_archivo(diccionario)
{
    let aux = 1;
    let archivo = process.argv[2];
    if (archivo != undefined && fs.existsSync(archivo)){
        let contenido = fs.readFileSync(archivo, 'ASCII');      //leo todo el archivo
        let palabras = contenido.split(' ');                    //me quedo con las palabras

        palabras.forEach(palabra =>{                            //por cada palabra del archivo la cargo al diccionario o la cuento
            if(diccionario.key.has(palabra))
                diccionario.value++;
            else{
                
            }
        });
    
        
    } else
        aux = 0;

    return aux;
};

/** PROGRAMA PRINCIPAL */

let diccionario = new Map; /** key: palabra         value:  cant apariciones*/
