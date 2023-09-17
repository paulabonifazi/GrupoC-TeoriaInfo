const { isNull } = require('util');

main();

function main(){
    var setpar=new Map;
    const fs = require('fs');
    var contenido=fs.readFileSync('tp2_sample2.txt','ASCII');
    var palabras=contenido.split(' ');
    let suma=0;
    for (let i=0;i<palabras.length;i++){
        suma++;
        if (setpar.has(palabras[i])){
            const aux=setpar.get(palabras[i])+1;
            setpar.set(palabras[i],aux);
        }else
            setpar.set(palabras[i],1); 
    }
    let letra;
    let vec=[];
        
    setpar.forEach((valor, clave) => {
        console.log(clave,":" ,valor," prob:", valor/suma);
        for (let i = 0; i < clave.length; i++) {
            letra = clave[i];
            if (!vec.includes(letra))
            vec.push(letra);
        }
    }); 
    console.log(vec);
    console.log('entropia:',enthropy(suma,vec,setpar));
    console.log('longitud media:',longitudMedia(suma,setpar));
    console.log('valor de kraft:',ecuacionKraft(vec,setpar));
    console.log("es compacto: ",iscompacto(suma,vec,setpar));
    if (ecuacionKraft(vec,setpar)<=1)
        console.log("es instantaneo: ",isinstantaneo(setpar));
}
function iscompacto(suma,vec,setpar){
    let r=vec.length;
    let ans=true
    setpar.forEach((valor, clave) => {
        let val=Math.round(logaritmoBaseN(suma/valor,r));
        if (clave.length!=val)
            ans=false;
    }); 
    return ans;
}
function enthropy(suma,vec,setpar){
    let sum=0;
    let cant=vec.length;
    setpar.forEach((valor, clave) => {
        sum+=(valor/suma)*logaritmoBaseN(suma/valor,cant);
    }); 
    return sum;
}
function logaritmoBaseN(x, n) {
    if (x <= 0 || n <= 0) {
      throw new Error("Los argumentos deben ser positivos.");
    }
    const logaritmoNaturalX = Math.log(x);
    const logaritmoNaturalN = Math.log(n);
  
    return logaritmoNaturalX / logaritmoNaturalN;
}
function longitudMedia(suma,setpar){
    let sum=0;
    setpar.forEach((valor, clave) => {
        sum+=(valor/suma)*clave.length;
    }); 
    return sum;
}
function ecuacionKraft(vec,setpar){
    let sum=0;
    let cant=vec.length;
    setpar.forEach((valor, clave) => {
        sum+=cant**(-clave.length);
    }); 
    return sum;
}
function isinstantaneo(setpar){
    let aux=new Array;
    let i=0;
    setpar.forEach((valor, clave) => {
        aux[i]=clave;
        i++;
    }); 
    i=0;
    var cond=false;
    while (i<aux.length && cond==false){
        let j=0;
        while (j<aux.length && cond==false){
            if (j!=i){
                cond=aux[j].startsWith(aux[i]);
            }
            j++;
        }
        i++;
    }
    return !cond;
}
