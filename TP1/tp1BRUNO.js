var matbin=new Array;
var vecbin=[0,0];
matbin=[[0,0],[0,0]]; 
lecturaArch(matbin,vecbin);
console.log("matriz: ",matbin);
matProb(matbin);
console.log("matriz de probabilidades:",matbin);
if (isnula(matbin))
    console.log("entropia nula:",entropianula(matbin));
else
    console.log("entropia no nula:",entropiaNOnula(matbin));
function lecturaArch(matbin,vecbin) {
    const fs = require('fs');
    if (process.argv[2]!=undefined && fs.existsSync(process.argv[2])){
        const archivo = fs.openSync(process.argv[2], 'r');
        const buffer = Buffer.alloc(1);
        let bytesRead;
        let a=-1;
        while ((bytesRead = fs.readSync(archivo, buffer, 0, 1, null)) !== 0) {
            for (let i=7;i>=0;i--){
                    var b=(buffer[0]>>i)&1;
                    if (a!=-1)
                      matbin[b][a]++;
                    vecbin[b]++;
                  a=b;
            }
        }
        fs.closeSync(archivo);
    }
}
function matProb(matbin){
    let sum1=matbin[0][0]+matbin[1][0];
    let sum2=matbin[0][1]+matbin[1][1];
    if (sum1!=0){
        matbin[0][0]/=sum1;
        matbin[1][0]/=sum1;
    }
    if (sum2!=0){
        matbin[0][1]/=sum2;
        matbin[1][1]/=sum2;
    }
}
function isnula(matbin){
    if (Math.abs(matbin[0][0]-matbin[0][1])<=0.015 && (Math.abs(matbin[1][0]-matbin[1][1])<=0.015))
        return true;
    else
        return false;

}
function entropianula(matbin){
    var sum=matbin[0][0]*Math.log2(1/matbin[0][0])+matbin[1][0]*Math.log2(1/matbin[1][0]);
    if (process.argv[3]!=undefined){
        muestracombinacion(matbin);
        sum*=process.argv[3];
    }
    return sum;
}
function muestracombinacion(matbin){
    for (let i=0;i<2**process.argv[3];i++)
        combinacion(matbin,i);
}
function combinacion(matbin,num){
    const vec=[process.argv[3]];
    let sum=1;
    for (let j=0;j<process.argv[3];j++){
        vec[j]=Math.trunc(num%2);
        sum*=matbin[vec[j]][vec[j]];
        num/=2;
    }
    console.log(vec.join(''),"probabilidad:",sum);
    
}
function entropiaNOnula(matbin){
    let x=[0,0];
    //uso auxiliares asi no perdemos la matriz original
    let aux1=matbin[0][0]-1;
    let aux2=matbin[0][1];
    //todo esto sale de despejar en la matriz de forma manual, recordar que:
    //las diagonales se le resta 1 y
    //que solo usamos una fila de la matriz, la otra es el x+y=1
    x[0]=-aux2/(aux1-aux2);
    x[1]=1-x[0];
    console.log("vector estacionario:",x);
    var sum=0;
    sum+=matbin[1][0]*Math.log2(1/matbin[1][0])*x[0]+matbin[0][0]*Math.log2(1/matbin[0][0])*x[0];
    sum+=matbin[1][1]*Math.log2(1/matbin[1][1])*x[1]+matbin[0][1]*Math.log2(1/matbin[0][1])*x[1];
    return sum;
}