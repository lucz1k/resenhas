// fluxo/executores.js

// Importa todos os executores de etapas do fluxo
import { executarBatalhao } from './tipos/batalhao.js';
import { executarCia } from './tipos/cia.js';
import { executarPelotao } from './tipos/pelotao.js';
import { executarNatureza } from './tipos/natureza.js';
import { executarData } from './tipos/data.js';
import { executarHora } from './tipos/hora.js';
import { executarEndereco } from './tipos/endereco.js';
import { executarTexto } from './tipos/texto.js';
import { executarEquipe } from './tipos/equipe.js';
import { executarApoio } from './tipos/apoio.js';
import { executarEnvolvidos } from './tipos/envolvidos.js';
import { executarVeiculos } from './tipos/veiculos.js';
import { executarObjetos } from './tipos/objetos.js';
import { executarArmamentos } from './tipos/armamentos.js';
import { executarHistorico } from './tipos/historico.js';
import { executarFormaAcionamento } from './tipos/formaAcionamento.js';
import { executarGrandeComando } from './tipos/grandeComando.js';

// Mapeia cada tipo de etapa ao seu executor correspondente
export const executores = {
  texto: executarTexto,
  textoOpcional: executarTexto,
  data: executarData,
  hora: executarHora,
  endereco: executarEndereco,
  equipe: executarEquipe,
  apoio: executarApoio,
  envolvidos: executarEnvolvidos,
  veiculos: executarVeiculos,
  objetos: executarObjetos,
  armamentos: executarArmamentos,
  historico: executarHistorico,
  batalhao: executarBatalhao,
  cia: executarCia,
  pelotao: executarPelotao,
  natureza: executarNatureza,
  formaAcionamento: executarFormaAcionamento,
  grandeComando: executarGrandeComando,
};
