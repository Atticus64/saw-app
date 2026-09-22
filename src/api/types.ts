export interface Editor {
  id: string;
  nombre: string;
  valores: number[];
}

export interface EditorSaw {
  nombre: string;
  valoresNormalizados: number[];
  puntaje: number;
}

export interface SawResponse {
  mensaje: string;
  tablaNormalizada: EditorSaw[];
  ranking: EditorSaw[];
}

export interface EditorTopsis {
  nombre: string;
  valores: number[];
}

export interface DetalleTopsis {
  nombre: string;
  distanciaPositiva: number;
  distanciaNegativa: number;
  puntajeFinal: number;
}

export interface SolucionesIdeales {
  idealPositiva: number[];
  idealNegativa: number[];
}

export interface TopsisDatos {
  matrizNormalizada: EditorTopsis[];
  matrizPonderada: EditorTopsis[];
  solucionesIdeales: SolucionesIdeales;
  detallesYResultados: DetalleTopsis[];
  rankingFinal: DetalleTopsis[];
}

export interface TopsisResponse {
  mensaje: string;
  datos: TopsisDatos;
}