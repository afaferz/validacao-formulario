//Enviar o formulário para o e-mail da pessoa que preecheu com uma mensagem em template HTML agradecendo pela visita :D

import mascara from '../helpers/mascaras.js';
import apiCep from '../services/cep.js';


let Validacao = class Validacao {
  constructor(input, formulario){
    this.formulario = formulario;
    this.inputType = input;
    this.inputs = formulario.querySelectorAll('input');
  };

  get mensagensErro(){
    return {

      campoVazio: 'O campo não pode estar vazio',

      email: {
        emailInvalido: 'O e-mail digitado não é válido'
      },

      senha: [
        'A senha deve conter pelo menos UMA letra maiúscula',
        'A senha deve conter pelo menos UM número',
        'A senha deve conter pelo menos UM símbolo',
        'A senha deve conter no mínimo 6 digitos',
      ],

      cep: {
        buscaInvalido: 'CEP não encontrado',
        fetchInvalido: 'Ouve um erro em sua busca. Por favor, digite seu CEP novamente'
      },

    };
  };

  get containerInput(){
    const senhaInput = document.querySelector('[data-mensagem-senha]');

    return {
      senha: senhaInput,
    };
  };

  get inputFunctions(){
    return {
      nome: input => this.nome(input),
      sobrenome: input => this.sobrenome(input),
      senha: input => this.senha(input),
      email: input => this.email(input),
      cep: input => this.cep(input),
    };
  };

  get camposRegEx(){
    const RegEx = {
      senha: {
        RegEx: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`[!"#$%&'()*+,-./:;<=>?@[\]^_{])[0-9a-zA-Z`[!"#$%&'()*+,-./:;<=>?@[\]^_{]{6,}$/,
        grupos: {
          regExMaiuscula: /(?=.*[A-Z])/,
          regExNumero: /(?=.*\d)/,
          regExSimbolo: /(?=[`[!"#$%&'()*+,-./:;<=>?@[\]^_{])/,
          regExTamanho: /(.{6,})/,
        }
      },
      email: {
        RegEx: /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/,
      }
    };
    return RegEx;
  };

  nome(input){
    input.value = mascara.nomeSobrenome(input.value);
  }

  sobrenome(input){
    input.value = mascara.nomeSobrenome(input.value);
  }

  //Validação - Senha
  senha(input){
    const value = input.value;

    const senhaSpans = Array.from(this.containerInput.senha.children);

    //Validação dinâmica dos grupos de RegEx da senha
    Object.keys(this.camposRegEx.senha.grupos).forEach((item, index)=>{
      if(this.camposRegEx.senha.grupos[item].test(value)){
        senhaSpans[index].classList.replace('invalido', 'valido');
      }
      else{
        senhaSpans[index].classList.replace('valido', 'invalido');      
      };
    });

    //Validação para as mensagens de erro 
    if((input.validity.valid == true) && this.camposRegEx.senha.RegEx.test(input.value)){
      this.containerInput.senha.classList.replace('on', 'off');
    }
    else{
      this.containerInput.senha.classList.replace('off', 'on');
      input.classList.replace('valid', 'invalid');
    };
  };

  mensagemErroSenha(input){    
    
    input.addEventListener('focus', () =>{
      Array.from(this.containerInput.senha.children).forEach((span, index)=>{
        span.innerHTML = this.mensagensErro.senha[index];
    });
      
    this.containerInput.senha.classList.replace('off', 'on');
    
    });
  };

  get inputEmail(){
    return Array.from(document.querySelectorAll('[data-type="email"]'))
    .map(el=>{
      return el.value;
    });

  }

  //Validação - E-mail
  email(input){
    const RegExTest = this.camposRegEx.email.RegEx.test(input.value);

    //Testar se o email é válido
    if(!RegExTest){
      return this.mensagemErroEmail(input);
    }
  };

  mensagemErroEmail(input){    
    const spanEmail = document.querySelector('[data-mensagem-email]');

    if(!input.validity.valid){
      spanEmail.innerHTML = this.mensagensErro.email.emailInvalido;
    }
    else{
      spanEmail.style.display = 'none';
    }    
  };

  get inputEndereco(){
    return {
      rua: document.querySelector('[data-rua]'),
      bairro: document.querySelector('[data-bairro]'),
      cidade: document.querySelector('[data-cidade]'),
      estado: document.querySelector('[data-estado]'),
    };
  };

  async cep(input){
    input.value = mascara.cep(input.value).clientCep;

    if(input.value.length >= 10 && input.validity.valid){

      return apiCep(mascara.cep(input.value).serverCep)
      .then(endereco =>{
        if((endereco === undefined) || (endereco === null)){

          input.value = '';
          Object.keys(this.inputEndereco).forEach(item=>{
            this.inputEndereco[item].value = '';
          });

          return;
        }
        else{
          this.inputEndereco.rua.value = endereco.logradouro;
          this.inputEndereco.bairro.value = endereco.bairro;
          this.inputEndereco.cidade.value = endereco.localidade;
          this.inputEndereco.estado.value = endereco.uf;
        };

        return;
      });
    };
  };

 //Validação - Todos os campos com 'blur'
  validarCampos(input){
    const inputType = input.dataset.type;

    if(this.inputFunctions[inputType]){
      this.inputFunctions[inputType](input);
    };
  };

  executarValidacao(){
    this.inputType.forEach(inputTag => {
      // Dupla Validação de Inputs

      //Validação RegEx
      inputTag.addEventListener('input', event => {
        this.validarCampos(event.target);
      });

      //validação ao perder o foco - Exceto CEP
      if(inputTag.getAttribute('data-type') !== 'cep'){
        inputTag.addEventListener('blur', event => {
          this.validarCampos(event.target);
        });
      };
    });
  };
};

export default Validacao;