function receberCep(cep){
  return fetch(`https://viacep.com.br/ws/${cep}/json/ `,
    {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-type' : 'application/json'
      },
    }
  )
  .then(resp =>{
    return resp.json();
  })
  .then(dados =>{

    if(dados.erro){
      alert('CEP não encontrado');
      return;
    }
    return dados;
  })

};

export default receberCep;