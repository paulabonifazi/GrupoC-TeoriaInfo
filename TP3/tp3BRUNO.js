const { Console } = require('console');
const fs = require('fs');
class Nodo {
    constructor(caracter, frecuencia) {
        this.caracter = caracter;
        this.frecuencia = frecuencia;
        this.izquierda = null;
        this.derecha = null;
    }
}

let datosTXT=[];
let setpar=new Map;
main();

function generarTablaCodigosHuffman(arbol, codigo = '', tabla = {}) {
    if (arbol.caracter !=null) {
        tabla[arbol.caracter] = codigo;
    } else {
        generarTablaCodigosHuffman(arbol.izquierda, codigo + '1', tabla);
        generarTablaCodigosHuffman(arbol.derecha, codigo + '0', tabla);
    }
    return tabla;
}

function lectura_arch(){
    const fs = require('fs');
    if (process.argv[2]!=undefined && fs.existsSync(process.argv[2])){
        var contenido=fs.readFileSync(process.argv[2],'ASCII');
        datosTXT=contenido.split('');
        for (let i=0;i<datosTXT.length;i++){
            var palabra=datosTXT[i];
            for (let j=0;j<palabra.length;j++){
                if (setpar.has(palabra[j])){
                    let valor=setpar.get(palabra[j]);
                    valor++;
                    setpar.set(palabra[j],valor);
                }else{
                    setpar.set(palabra[j],1); 
                }
            }
        }
        return true;
    }else
        return false;
}

function filtrar_codigo(){
    const arrayOrdenado = Array.from(setpar.entries());
    arrayOrdenado.sort(function(a, b) {
        return a[1] - b[1];
    });
    return new Map(arrayOrdenado);
}

function construirArbolHuffman() {
    const colaPrioridad = [];
    setpar.forEach((valor, clave) => {
        const nodo = new Nodo(clave, valor);
        colaPrioridad.push(nodo);
    }); 
    while (colaPrioridad.length > 1) {
        colaPrioridad.sort((a, b) => a.frecuencia - b.frecuencia);

        const nodoIzquierda = colaPrioridad.shift();
        const nodoDerecha = colaPrioridad.shift();

        const nuevoNodo = new Nodo(null, nodoIzquierda.frecuencia + nodoDerecha.frecuencia);
        nuevoNodo.izquierda = nodoIzquierda;
        nuevoNodo.derecha = nodoDerecha;

        colaPrioridad.push(nuevoNodo);
    }
    return colaPrioridad[0];
}

function intTobin(dato){
    const array=Array.from(String(dato),Number);
    let valor=0;
    for (let i=0;i<array.length;i++){
        valor+=array[i]*2**(array.length-1-i);
    }
    return valor;
}

function Comprimir(mapa){
    const vec=[];
    let bn=0;
    let byte=0b00000000;
    let aux;
    vec.push(setpar.size);//pongo la cantidad de caracteres que tiene nuestro alfabeto
    setpar.forEach((valor, clave) => {
        vec.push(clave.charCodeAt(0));
        const pa=(valor&0b1111111100000000)>>8;
        const pb=(valor&0b0000000011111111);
        vec.push(pa);
        vec.push(pb);
    });
    //lo que hice arriba es:
    /*
    la cabecera de nuestro archivo binario es cant claves(1b), clave(1b), frecuencia(2b)
    */
    for (let i=0;i<datosTXT.length;i++){
        const pal=mapa.get(datosTXT[i]);
        for (let k=0;k<pal.length;k++){
            byte=byte<<1
            if (pal[k]==1)
                byte|=0b00000001;
            bn++;
            if (bn==8){
                vec.push(byte);
                byte=0b00000000;
                bn=0;
            }
        }
    }
    //aca arriba lo q hace es tomar caracater a carater del txt original, pasarlo a bits y subirlo como cadena de bytes al archivo comprimido despues de la cabecera
    const datosBinarios = Buffer.from(vec);
    const rutaArchivo = "Compressed.bin";
    fs.writeFileSync(rutaArchivo, datosBinarios, 'binary');
}

function Descomprimir(dir,dir2){
    const data = fs.readFileSync(dir);
    let num=0
    const mapa=new Map;

    for (let i=1;i<=data[0]*3;i+=3){
        num=0;
        num|=data[i+1]
        num=num<<8
        num|=data[i+2]
        mapa.set(String.fromCharCode(data[i]),num);
    }
    setpar=mapa;
    //primero reconstruimos las claves con su frecuencia
    let arbol=construirArbolHuffman(mapa);
    const raiz=construirArbolHuffman(mapa);
    //armamos el arbol nuevamente

    let i=data[0]*3+1;
    let byte=data[i];
    let bn=7;
    const vec=[];
    let bit;
    // lo que pasa en este while es: va agarrando bit a bit y se va moviendo por el arbol
    //hasta encontrar un caracter, lo imprime en la descompresion y vuelve a la rezi para seguir buscando
    while (i<data.length){
        bit=(byte>>bn)&0b1;
        if (arbol.caracter === null) {
            if (bit==1)
                arbol=arbol.izquierda;
            else
                arbol=arbol.derecha;
        }
        if (arbol.caracter!=null){
            vec.push(arbol.caracter);
            arbol=raiz;
        }
        bn--
        if (bn==-1){
            bn=7;
            i++;
            byte=data[i];
        }
    }
    fs.writeFileSync(dir2, vec.join(''));
}

function Tdescompresion(dir1,dir2){
    //dir1 es la direccion del arch original
    //dir2 es el comprimido
    const s1 = fs.statSync(dir1);
    const s2 = fs.statSync(dir2);
    return s1.size/s2.size;
}

function rendimiento(tabla){
    const mapl=new Map;
    let suma=0;
    const vec=[];
    let longitudM=0;
    let i=0;
    let entropia=0;

    Object.entries(tabla).forEach(function([key, value]) {
        mapl.set(key,value.length);
    });
    setpar.forEach((valor, clave) => {
        suma+=valor;
        vec.push(valor);
    });
    setpar.forEach((valor, clave) => {
        entropia+=(valor/suma)*Math.log2(suma/valor);
        longitudM+=mapl.get(clave)*(valor/suma);
    });
    return entropia/longitudM;
}

function main(){
    let arbol;
    let tabla;
    if (process.argv[4]=='-c'){
        lectura_arch();//de aca sale datosTXT(todo el txt) y setpar(clave y prob)
        setpar=filtrar_codigo();//ordenamos setpar
        arbol=construirArbolHuffman();//en base a setpar creamos el arbol
        const raiz=construirArbolHuffman();//copia del arbol para la compresion
        tabla=generarTablaCodigosHuffman(arbol);//tabla tiene clave y codigo asociado
        const mapafinal=new Map;//basicamente paso la tabla a la estructura de mapa
        Object.entries(tabla).forEach(function([key, value]) {
            mapafinal.set(key,value);
        });
        Comprimir(mapafinal);
        console.log("Comprimio correctamente");
    }else if (process.argv[4]=='-d'){
        Descomprimir(process.argv[3],"Decompressed.txt");
        console.log("Descomprimio correctamente");
        arbol=construirArbolHuffman();//los vuelvo a calcular para los calculos de abajo
        tabla=generarTablaCodigosHuffman(arbol);//idem
    }
    console.log("tasa de descomprecion:",Tdescompresion(process.argv[2],process.argv[3]));
    console.log("rendimiento:",rendimiento(tabla));
    console.log("redundancia:",1-rendimiento(tabla));
}