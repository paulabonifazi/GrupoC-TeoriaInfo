/** programita para ordenar un map
 * 
 * pasa el map a un array de pares, al array lo ordena y luego vuelve a crear un map
 */

let miMap = new Map();

miMap.set("clave1", 3);
miMap.set("clave2", 10);
miMap.set("clave3", 20);

let arrayDePares = Array.from(miMap);

arrayDePares.sort(function(a, b) {
    return b[1] - a[1];
});


let simbolos = new Map(arrayDePares);


for (let [i, j] of simbolos) {
    simbolos.set(i, (j/simbolos.size).toFixed(4));                                      //calculo la prob de cada símbolo
}






/** probando implementación árbol */
let nodos = [];                                                             //almaceno los nodos en un array

function Nodo(prob, clave) {
    this.prob = prob;
    this.clave = clave;
    this.izquierdo = null;
    this.derecho = null;
}

for (let [i, j] of simbolos) {
    nodos.push(new Nodo(j, i));
}


function creaArbol(arbol, nodos, n){
    if (n > 0) {
        console.log(nodos[n].prob)
        if (nodos[n].prob >= arbol.prob) {
            console.log("ifff");
            let nodoAux = newNodo(nodos[n].prob + arbol.prob, nodos[n].clave + arbol.clave);
            console.log(nodoAux.clave, nodoAux.prob);
            
            nodoAux.izquierdo = nodos.pop();                                  //el nodo con menor prob pasa a ser el hijo izq
            nodoAux.derecho = arbol;                                        //el hijo der es la cabecera del arbol
            nodoAux = arbol;                                                //el nuevo nodo pasa a ser el arbol
        } 
        else {                                                              //tengo que buscar las dos claves con menor prob y crear un nuevo nodo
            console.log("elseeee");
            let nodoAux1 = nodos.pop();
            let nodoAux2 = nodos.pop();
            let nodoNuevo = newNodo(nodoAux1.prob + nodoAux2.prob, nodoAux1.clave + nodoAux2.clave);   
            nodos.push(nodoNuevo);
        }
        creaArbol(arbol, nodos, n-1);
    }
}


/** ---------- PROGRAMA PRINCIPAL ----------------------- */

console.log(miMap);
//console.log(mapOrdenado.size);
console.log(simbolos);

for (let i of nodos) {
    console.log(i.clave, "  ", i.prob);
}



let arbol = nodos.pop();                                                      //le asigno al arbol el último elemento del vec

console.log(nodos.length)
//console.log(arbol.clave);


creaArbol(arbol, nodos, nodos.length-1);

//console.log(arbol.clave);
