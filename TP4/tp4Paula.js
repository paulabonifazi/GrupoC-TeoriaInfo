const { hasSubscribers } = require("diagnostics_channel");
const fs = require("fs");
let N;                                                                      //cantidad de mjs
let M;                                                                      //longitud de mjs


/** FUNCIONES */
function leeArchivo(prob, canal) {
    let archivo = process.argv[2];
    N = process.argv[3];
    M = process.argv[4];

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
                case 0: prob[0] = parseFloat(palabras[k]);
                    break;
                case 1: prob[1] = parseFloat(palabras[k]);
                    break;
                case 2: canal[0][0] = parseFloat(palabras[k]);
                    break;
                case 3: canal[0][1] = parseFloat(palabras[k]);
                    break;
                case 4: canal[1][0] = parseFloat(palabras[k]);
                    break;
                case 5: canal[1][1] = parseFloat(palabras[k]);
                    break;            
            }
        }
      
    }
    catch (error){
        console.error("Error al leer el archivo", error);
    }
}
//ecuacion 2
function calculoProbDeUnCanal(probB,prob,canal){
    probB[0]=prob[0]*canal[0][0]+prob[1]*canal[1][0];
    probB[1]=prob[0]*canal[0][1]+prob[1]*canal[1][1];

}
//ecuacion 3
function calculoProbConociendoLlegada(probB,prob,canal,probArespectoB){
    if(probB[0]!=0){
        probArespectoB[0][0]=(prob[0]*canal[0][0])/probB[0];
        probArespectoB[1][0]=(prob[1]*canal[1][0])/probB[0];
    }
    if(probB[1]!=0){
        probArespectoB[0][1]=(prob[0]*canal[0][1])/probB[1];
        probArespectoB[1][1]=(prob[1]*canal[1][1])/probB[1];
    }
}
//ecuacion 4
function calculoProbSucesosSimultaneos(prob,canal,probSuceso){
    probSuceso[0][0]=prob[0]*canal[0][0];
    probSuceso[0][1]=prob[0]*canal[0][1];
    probSuceso[1][0]=prob[1]*canal[1][0];
    probSuceso[1][1]=prob[1]*canal[1][1];
}
function Equivocacion(probSuceso,probArespectoB,canal,equivocacion){
    // equivocacion 0 es H[A/B]   
    if(probArespectoB[0][0]!=0){
        equivocacion[0]=probSuceso[0][0]*Math.log2(1/probArespectoB[0][0]);
    }
    if(probArespectoB[0][1]!=0){
        equivocacion[0]+=probSuceso[0][1]*Math.log2(1/probArespectoB[0][1]);
    }
    if(probArespectoB[1][0]!=0){
        equivocacion[0]+=probSuceso[1][0]*Math.log2(1/probArespectoB[1][0]);
    }
    if(probArespectoB[1][1]!=0){
        equivocacion[0]+=probSuceso[1][1]*Math.log2(1/probArespectoB[1][1]);
    }

    // equivocacion 1 es H[B/A]
    if(canal[0][0]!=0){
        equivocacion[1]=probSuceso[0][0]*Math.log2(1/canal[0][0]);
    }
    if(canal[0][1]!=0){
        equivocacion[1]+=probSuceso[0][1]*Math.log2(1/canal[0][1]);
    }
    if(canal[1][0]!=0){
        equivocacion[1]+=probSuceso[1][0]*Math.log2(1/canal[1][0]);
    }
    if(canal[1][1]!=0){
        equivocacion[1]+=probSuceso[1][1]*Math.log2(1/canal[1][1]);
    }
   
}
function entropiaAPriori(probabilidad){
    let hApriori=0;
    if(probabilidad[0]!=0){
        hApriori=probabilidad[0]*Math.log2(1/probabilidad[0]);
    }
    if(probabilidad[1]!=0){
        hApriori+=probabilidad[1]*Math.log2(1/probabilidad[1]);
    }
    return hApriori;
}
function informacionMutua(entropia,equi){
    return entropia-equi;
}
function entropiaAPosteriori(probArespectoB,canal,hAposteriori){
    //H(A/b1)     
    if(probArespectoB[0][0]!=0){
        hAposteriori[0][0]=probArespectoB[0][0]*Math.log2(1/probArespectoB[0][0]);
    }
    if(probArespectoB[1][0]!=0){
        hAposteriori[0][0]+=probArespectoB[1][0]*Math.log2(1/probArespectoB[1][0]);
    }
    
    //H(A/b2)
    if(probArespectoB[0][1]!=0){
        hAposteriori[0][1]=probArespectoB[0][1]*Math.log2(1/probArespectoB[0][1]);
    }
    if(probArespectoB[1][1]!=0){
        hAposteriori[0][1]+=probArespectoB[1][1]*Math.log2(1/probArespectoB[1][1]);
    }

     //H(B/a1)     
    if(canal[0][0]!=0){
        hAposteriori[1][0]=canal[0][0]*Math.log2(1/canal[0][0]);
    }
    if(canal[0][1]!=0){
        hAposteriori[1][0]+= +canal[0][1]*Math.log2(1/canal[0][1]);
    }
   
    //H(B/a2)
    if(canal[1][0]!=0){
        hAposteriori[1][1]=canal[1][0]*Math.log2(1/canal[1][0]);
    }
    if(canal[1][1]!=0){
        hAposteriori[1][1]+=canal[1][1]*Math.log2(1/canal[1][1]);
    }
}
function xorBinario(vec){
    let resp=0;
    for (let k=0;k<vec.length;k++){
        if (vec[k]==1)
        resp++; 
    }
    if (resp%2==0)
            return 0;
        else
            return 1;
}
function copiacolumna(j,matriz){
    const aux=[];
    for (let i=0;i<N;i++){
        aux.push(matriz[i][j]);
    }
    return aux;
}
function paridadCruzada(matrizMNJ,PmatrizMNJ){
    for (let i=0;i<=N;i++){
        for (let j=0;j<=M;j++){
            if (i==N && j==M){
                let vec1=PmatrizMNJ[i];
                vec1.pop();
                let vec2=copiacolumna(j,PmatrizMNJ);
                PmatrizMNJ[i][j]=xorBinario(vec1)^xorBinario(vec2);
            }else{
                if (i==N){
                    PmatrizMNJ[i][j]=xorBinario(copiacolumna(j,matrizMNJ));
                }else{
                    if (j==M){
                        PmatrizMNJ[i][j]=xorBinario(matrizMNJ[i]);
                    }else{
                        PmatrizMNJ[i][j]=matrizMNJ[i][j];
                    }
                }
            }
        }
    }
}
function recepcionParidad(PmatrizMNJ,matrizRC,PmatrizRC,canal){
    for (let i=0;i<=N;i++){
        for (let j=0;j<=M;j++){
            if (i==N || j==M){
                const NA=Math.random();
                const num=PmatrizMNJ[i][j];
                if (NA>canal[num][0])
                    PmatrizRC[i][j]=1;
                else
                    PmatrizRC[i][j]=0;
            }else{
                PmatrizRC[i][j]=matrizRC[i][j];
            }
        }


    }
}
function creaRecepcion(canal,matrizMNJ,matrizRC){
    for (let i=0;i<N;i++){
        for (let j=0;j<M;j++){
            const num=matrizMNJ[i][j];
            const NA=Math.random();
            if (NA>canal[num][0])
                matrizRC[i][j]=1;
            else
                matrizRC[i][j]=0;
        }
    }

}
function creaMensaje(prob,matrizMNJ){
    for (let i=0;i<N;i++){
        for (let j=0;j<M;j++){
            const NA=Math.random();
            if (NA>prob[0])
                matrizMNJ[i][j]=1;
            else
                matrizMNJ[i][j]=0;
        }
    }
}
function simularEnvioMensaje(prob,canal,matrizMNJ,matrizRC){
    creaMensaje(prob,matrizMNJ);
    console.log("Mensajes enviados:",matrizMNJ);
    creaRecepcion(canal,matrizMNJ,matrizRC);
    console.log("Mensajes recibidos:",matrizRC);
    if (process.argv[5]=="-p"){
        const n1=parseInt(N)+1;
        const m1=parseInt(M)+1;
        const PmatrizMNJ = Array.from({ length: n1 }, () => Array(m1).fill(0));
        const PmatrizRC = Array.from({ length: n1 }, () => Array(m1).fill(0));
        paridadCruzada(matrizMNJ,PmatrizMNJ);
        recepcionParidad(PmatrizMNJ,matrizRC,PmatrizRC,canal);
        console.log("matriz paridad RECIBIDA:",PmatrizRC);
    }
    let iguales=0;
    for (let i=0;i<N;i++){
        const s1=matrizMNJ.join('');
        const s2=matrizRC.join('');
        if (s1==s2)
            iguales++;
    }
    console.log("cantidad de mensajes iguales:",iguales);
    console.log("cantidad de mensajes diferentes:",parseInt(N)-iguales);
}


/* PROGRAMA PRINCIPAL */
let prob = [];                                                              //vector de probabildiades de la fuente
let canal = [[],[]];                                                        //matriz del canal
let probB=Array.from({ length: 2 }, () => 0);                                  
let probSuceso= Array.from({ length: 2 }, () => Array(2).fill(0));                //iniciliza matriz en 0
let probArespectoB= Array.from({ length: 2 }, () => Array(2).fill(0));
let equivocacion=Array.from({ length: 2 }, () => Array(2).fill(0));
let hAposteriori=Array.from({ length: 2 }, () => Array(2).fill(0));
let hFuente,hLlegada;

leeArchivo(prob, canal);
console.log("probabilidad de la fuente: ", prob);
console.log("matriz del canal ", canal);

calculoProbDeUnCanal(probB,prob,canal);
console.log("probabilidad del canal: ", probB);

calculoProbConociendoLlegada(probB,prob,canal,probArespectoB);
console.log("probabildiad de A respecto de B: ", probArespectoB);

calculoProbSucesosSimultaneos(prob,canal,probSuceso);
console.log("probabilidad del suceso simultaneo:", probSuceso);

Equivocacion(probSuceso,probArespectoB,canal,equivocacion);
console.log("Equivocacion de A con respecto a B "+equivocacion[0]+"\nEquivocacion de B con respecto a A "+equivocacion[1]);

hFuente=entropiaAPriori(prob);
hLlegada=entropiaAPriori(probB);
console.log("Entropia a Priori de A---->"+hFuente);
console.log("Entropia a Priori de B---->"+hLlegada);

//Las informaciones deberias ser iguales
console.log("Informacion mutua I(A,B)---->"+informacionMutua(hFuente,equivocacion[0]));
console.log("Informacion mutua I(B,A)---->"+informacionMutua(hLlegada,equivocacion[1]));

entropiaAPosteriori(probArespectoB,canal,hAposteriori);
console.log("Entropia a posteriori A/b1--->"+hAposteriori[0][0]+"\nEntropia a posteriori A/b2--->"+hAposteriori[0][1]+"\nEntropia a posteriori B/a1--->"+hAposteriori[1][0]+"\nEntropia a posteriori B/a2--->"+hAposteriori[1][1]);

const matrizMNJ = Array.from({ length: N }, () => Array(M).fill(0));
const matrizRC = Array.from({ length: N }, () => Array(M).fill(0));
simularEnvioMensaje(prob,canal,matrizMNJ,matrizRC);