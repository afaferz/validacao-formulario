const mascaras = {
  nomeSobrenome(value){
    return value.replace(/[\d\s]/g, '');
  },

  cep(value){
    let clientCep = value
      //Bloqueia tudo que não seja número;
      .replace(/\D/g, '')
      //Insere o ponto depois dos dois primeiros caracteres
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,3})/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
    let serverCep = clientCep.replace(/\D/g, '');
    return {
      clientCep,
      serverCep
    }
  },
  
  telefone(value){
    return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1)\  $2')
    //Adiciona espaço entre o DDD o dígito 9 e o telefone
    .replace(/(\s)(\d)/, '$1 9 \ ')
    .replace(/(\d{4})(\d)/, '$1-$2')
  }
};
export default mascaras;