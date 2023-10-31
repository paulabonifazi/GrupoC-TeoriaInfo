/** programita para ordenar un map
 * 
 * pasa el map a un array de pares, al array lo ordena y luego vuelve a crear un map
 */

var miMap = new Map();

miMap.set("clave1", 3);
miMap.set("clave2", 10);
miMap.set("clave3", 20);

var arrayDePares = Array.from(miMap);

arrayDePares.sort(function(a, b) {
    return b[1] - a[1];
});


var mapOrdenado = new Map(arrayDePares);

console.log(miMap);
console.log(mapOrdenado);