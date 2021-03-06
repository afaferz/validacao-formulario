import Validacao from './validacao/Validacao.js';

const formulario = document.querySelector('[data-form]');

const inputSenha = document.querySelector('[data-senha]');

const inputType = document.querySelectorAll('[data-type]');


// Classe com regras de validação 
const validacao = new Validacao(inputType, formulario);

validacao.executarValidacao();

//Inicializa mensagens de erro
validacao.mensagemErroSenha(inputSenha);

