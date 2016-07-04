const axios = require('axios');
const cheerio = require('cheerio')
const fs = require('fs');



const instance = axios.create({
  headers: {'Referer' : 'http://www.4devs.com.br/gerador_conta_bancaria'}
});

const getBanco = axios.get('http://www.4devs.com.br/gerador_conta_bancaria')
.then(function (response) {
  const $ = cheerio.load(response.data);
  const str = $('script').text();
  const re = /token_calc\s*\=\s*\"(.*)\"\s*;/;
  let m;
  let cc = '1';
  let ag = '1';

  if ((m = re.exec(str)) !== null) {
    const token = m[1];
    return instance.post('http://www.4devs.com.br/ferramentas_online.php', 'token='+token+'&acao=gerar_conta_bancaria&estado=&banco=151')
      .then(function (response) {
        const $2 = cheerio.load(response.data);
        cc = $2('#conta_corrente').val();
        ag = $2('#agencia').val();
        return  {cc, ag};
      }).catch(function (err) {
        console.log(err);
        return {cc,ag}
      })
  }
  return {cc,ag}
})
.catch(function (error) {
  // console.log(error);
});


const getCPF = axios.get('https://www.geradordecpf.org/gerarcpf?pontuacao=0')
.then(function (response) {
  // return response.data;
  return response.data.toString();
})
.catch(function (error) {
  // console.log(error);
});


// const getEmail = Promise.resolve('zmqsfptf@zetmail.com');
const getEmail = axios.get('http://getairmail.com/random')
.then(function (response) {
  const $ = cheerio.load(response.data);
  const email = $('#tempemail').val();
  return email;
})
.catch(function (error) {
  // console.log(error);
});

module.exports = {
  getFakeData: function functionName() {
      return Promise.all([getCPF,getBanco, getEmail]).then(([cpf,{cc, ag}, email]) => {
        return {cpf, cc, ag, email}
      });
  }
};
