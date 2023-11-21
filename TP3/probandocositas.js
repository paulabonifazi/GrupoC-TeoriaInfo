/** programita para ordenar un map
 * 
 * pasa el map a un array de pares, al array lo ordena y luego vuelve a crear un map
 */

let miMap = new Map();

miMap.set("A", 0.15);
miMap.set("B", 0.3);
miMap.set("C", 0.2);
miMap.set("D", 0.05);
miMap.set("E", 0.15);
miMap.set("F", 0.05);
miMap.set("G", 0.1);



let arrayDePares = Array.from(miMap);

arrayDePares.sort(function(a, b) {
    return b[1] - a[1];
});


let simbolos = new Map(arrayDePares);



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
    if (n == 0)
        return arbol
    else {
        if (nodos[n].prob >= arbol.prob) {
            let nodoAux = new Nodo(parseFloat(nodos[n].prob) + parseFloat(arbol.prob), nodos[n].clave + arbol.clave);

            nodoAux.izquierdo = nodos.pop();                                //el nodo con menor prob pasa a ser el hijo izq
            nodoAux.derecho = arbol;                                        //el hijo der es la cabecera del arbol
            arbol = nodoAux;                                                //el nuevo nodo pasa a ser el arbol
        
        } 
        else {                                                              //tengo que buscar las dos claves con menor prob y crear un nuevo nodo
            let nodoAux1 = nodos.pop();
            let nodoAux2 = nodos.pop();
            let nodoNuevo = new Nodo(parseFloat(nodoAux1.prob) + parseFloat(nodoAux2.prob), nodoAux1.clave + nodoAux2.clave);   
            nodos.push(nodoNuevo);
            nodos.sort((a,b) => b - a);                                      //vuelvo a ordenar el vector decrecientemente
        }
        
        //console.log("raiz arbol: ", arbol.clave);
        //console.log("cantidad elementos array ", n);
        //nodos.forEach(element => {
            //console.log(element);
        //});

        return creaArbol(arbol, nodos, n-1);
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
console.log(arbol.clave);


arbol = creaArbol(arbol, nodos, nodos.length-1);

console.log(arbol.clave);
console.log(nodos);
