#include <stdio.h>
#include <stdlib.h>
#include "Funciones.h"

void open_file(int argc,char *argv,float mat_cup[2][2],int vec_bit[2]);
void set_matrizProb(mat_cup);
int isNula(float mat_cup[2][2]);
float entropiaNula(float mat_cup[2][2],int col);
int main(int argc,char *argv[]){
    float mat_cup[2][2]={0};//este cuenta la cnatidad de 00 01 10 11
    int vec_bit[2];//este la cantidad de 1 y 0
    if (argc>=2){
        char aux[10];
        strcpy(aux,argv[1]);
        open_file(argc,aux,mat_cup,vec_bit);
        set_matrizProb(mat_cup);
        if (isNula(mat_cup))
            printf("ENTROPIA (memoria nula): %f",entropiaNula(mat_cup,0));
        else
            entropiaNoNula(mat_cup);
    }else
        printf("no existe el archivo especificado");
}
void open_file(int argc,char *argv,float mat_cup[2][2],int vec_bit[2]){
    FILE *arch=fopen(argv,"rb");
    char dato;
    vec_bit[0]=0;// inicializo porque crasheaba si no (todo muy raro)
    vec_bit[1]=0;
    if (arch!=NULL){
        int a=-1,b=-1;
        while (fread(&dato,sizeof(char),1,arch)){
            for (int i=7;i>=0;i--){
                b=(dato>>i)&1;
                if (a!=-1)
                    mat_cup[b][a]++;
                a=b;
                vec_bit[b]++;
            }
        }
    }else
        return 0;
    printf("MATRIZ:\n%3.1f %3.1f\n%3.1f %3.1f\nVECTOR:\n%d %d",mat_cup[0][0],mat_cup[0][1],mat_cup[1][0],mat_cup[1][1],vec_bit[0],vec_bit[1]);
    fclose(arch);
}
void set_matrizProb(float mat_cup[2][2]){
    int aux=mat_cup[0][0]+mat_cup[1][0];
    if (aux!=0){
        mat_cup[0][0]/=aux;
        mat_cup[1][0]/=aux;
    }
    aux=mat_cup[0][1]+mat_cup[1][1];
    if (aux!=0){
        mat_cup[0][1]/=aux;
        mat_cup[1][1]/=aux;
    }
    printf("\nMATRIZ DE PROB:\n%3.3f %3.3f\n%3.3f %3.3f\n",mat_cup[0][0],mat_cup[0][1],mat_cup[1][0],mat_cup[1][1]);
}
int isNula(float mat_cup[2][2]){
    //uso el criterio del 1%
    if ((mat_cup[0][0]-mat_cup[0][1])<=0.01&&(mat_cup[1][0]-mat_cup[1][1])<=0.01)
        return 1;
    else
        return 0;
}
float entropiaNula(float mat_cup[2][2],int col){
    float suma=0;
    for (int i=0;i<=1;i++)
        suma+=mat_cup[i][col]*log2(1/mat_cup[i][col]);
    return suma;
}
void entropiaNoNula(float mat_cup[2][2]){
    float x[2];
    float mat[2][2];
    mat[0][0]=mat_cup[0][0]-1.0;
    mat[0][1]=mat_cup[0][1];
    mat[1][0]=mat_cup[1][0];
    mat[1][1]=mat_cup[1][1]-1.0;
    x[0]=-mat[0][1]/(mat[0][0]-mat[0][1]);
    x[1]=1-x[0];
    printf("VECTOR ESTACIONARIO:\n%f %f\n",x[0],x[1]);
    float suma=0;
    for (int i=0;i<2;i++){
        suma+=x[i]*entropiaNula(mat_cup,i);
    }
    printf("ENTROPIA (memoria no nula):\n%f\n",suma);
}



