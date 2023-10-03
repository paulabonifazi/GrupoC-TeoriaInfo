main();

function main(){
    var setpar=new Map;
    let vec=[];
    if (lectura_arch(setpar,vec)){//lo que hago es guardar el diccionario y la cantidad de apariciones
        var suma=sumar(setpar);
        muestra(setpar,vec,suma);
        console.log('entropia:',enthropy(suma,vec,setpar));
        console.log('longitud media:',longitudMedia(suma,setpar));
        console.log('valor de kraft:',ecuacionKraft(vec,setpar));
        console.log("es compacto: ",iscompacto(suma,vec,setpar));
        if (ecuacionKraft(vec,setpar)<=1)
            console.log("es instantaneo: ",isinstantaneo(setpar));
    }else
        console.log("error al abrir el archivo");
}
function lectura_arch(setpar,vec,sum){
    const fs = require('fs');
    if (process.argv[2]!=undefined && fs.existsSync(process.argv[2])){
        var contenido=fs.readFileSync(process.argv[2],'ASCII');
        var palabras=contenido.split(' ');
    
        for (let i=0;i<palabras.length;i++){
            if (setpar.has(palabras[i])){
                const aux=setpar.get(palabras[i])+1;
                setpar.set(palabras[i],aux);
            }else
                setpar.set(palabras[i],1); 
        }    
        setpar.forEach((valor, clave) => {
            for (let i = 0; i < clave.length; i++) {
                letra = clave[i];
                if (!vec.includes(letra))
                    vec.push(letra);
            }
        }); 
        return true;
    }else
        return false;
}
function muestra(setpar,vec,sum){
    
    setpar.forEach((valor, clave) => {
        let aux=valor/sum;
        console.log('codigo:',clave,'probabilidad:',aux);
    });
    console.log("diccionario: ",vec);
}
function sumar(setpar){
    let suma=0;
    setpar.forEach((valor, clave) => {suma+=valor;});
    return suma;
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
function iscompacto(suma,vec,setpar){
    let r=vec.length;
    for (const [clave, valor] of setpar) { 
        let val=Math.round(logaritmoBaseN(suma/valor,r));
        if (clave.length>val)
            return false;
    }; 
    return true;
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
