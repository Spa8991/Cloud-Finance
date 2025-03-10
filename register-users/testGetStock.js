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
         //{ target: 10, duration: '5s' },

         { target: 10, duration: '20s' }, 
        { target: 10, duration: '40s' }, 
        { target: 30, duration: '100s' }, 
        { target: 30, duration: '120s' }, 
        { target: 1, duration: '30s' }, 
      ],
    },
  },
};

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

  let res = http.get(APIGatewayURL, params);

  check(res, {
    'GET status was 200': (r) => r.status === 200,
  });
  console.log(`User: ${user.email}, Response: ${res.body}`); // Log della risposta per utente

  //sleep(5);
}
