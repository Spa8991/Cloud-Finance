import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
require('dotenv').config();
// Carica i token dal file JSON
const tokens = new SharedArray('authTokens', function() {
  return JSON.parse(open('authTokens_20.json'));
});

export const options = {
  scenarios: {
    fasi_test: {
      executor: 'ramping-arrival-rate',
      startRate: 1, // Inizia con 1 richiesta per timeUnit (1 iterazione al second)
      timeUnit: '1s', // unità di tempo per la rate
      preAllocatedVUs: 10, // numero di VUs preallocati
      maxVUs: 20, // numero massimo di VUs
      stages: [
        { target: 10, duration: '20s' }, 
        { target: 10, duration: '40s' }, 
        { target: 30, duration: '100s' }, 
        { target: 30, duration: '120s' }, 
        { target: 1, duration: '30s' },
        //{ target: 30, duration: '60s' }
      ],
    },
  },

};

/*
//fa 30 iterazioni al secondo costanti
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 30, // numero di iterazioni al secondo
      timeUnit: '1s', // unità di tempo
      duration: '1m', // durata del test
      preAllocatedVUs: 10, // numero di VUs pre-allocati
      maxVUs: 20, // numero massimo di VUs
    },
  },
};
 */

export default function() {
  // Ottieni l'indice dell'utente attuale
  const userIndex = __ITER % tokens.length;
  const user = tokens[userIndex];

  const APIGatewayURL =  process.env.APIGatewayURL;
  const params = {
    headers: {
      'Authorization': `Bearer ${user.authToken}`,
      'Content-Type': 'application/json'
    }
  };
  //converte il JSON in una stringa, perchè il server accetta solo stringhe
  //E' l'opposto di JSON.parse()
  const payload = JSON.stringify({ StockName: `Stock for ${user.email}` });
  let res = http.post(APIGatewayURL, payload, params);

  check(res, {
    'POST status was 201': (r) => r.status === 201,
  });
  console.log(`User: ${user.email}, Response: ${res.body}`); // Log della risposta per utente

  //sleep(1);
}