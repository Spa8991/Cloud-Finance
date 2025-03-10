import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
require('dotenv').config();
/*
// Carica i token dal file JSON che saranno usati nel test
const tokens = new SharedArray('authTokens', function() {
    return JSON.parse(open('authTokens_20.json'));
});

// Carica i dati StockId ed Email dal file JSON
const stockData = new SharedArray('stockData', function() {
    return JSON.parse(open('StockId_Email.json'));
});*/


// Carica il file JSON json_merge.json che saranno usati nel test
const stockData = new SharedArray('stockData', function() {
    return JSON.parse(open('tutto1.json'));
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
                //{ target: 1, duration: '1s' },

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
    const userIndex = __ITER % stockData.length;
    const user = stockData[userIndex];

    const APIGatewayURL =  process.env.APIGatewayURL;
    const params = {
        headers: {
            'Authorization': `Bearer ${user.authToken}`,
            //'Authorization': `Bearer eyJraWQiOiJ3UmhTR2dlODlkM3RhSEY0RHdSZUw1MStWZzFZY09VSW14VUNEN1JBNUpRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNDY4MjQyOC1kMDYxLTcwNTgtZWU3Mi1hZmExZTljOGQ2Y2IiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX2FMVW9zN2kzZiIsImNvZ25pdG86dXNlcm5hbWUiOiJjNDY4MjQyOC1kMDYxLTcwNTgtZWU3Mi1hZmExZTljOGQ2Y2IiLCJvcmlnaW5fanRpIjoiZDJlNTk3MzQtYzAwOC00NDg2LWI3NDctMWJkYjI2YzQ5NTVmIiwiYXVkIjoiNjYzZ211bGdvZTExMmUxaGc5MzQ4OTQyNjQiLCJldmVudF9pZCI6ImRmNjY1M2YzLTVhMjQtNDY3NS1iOTNhLTI5NzZiNjkzNzMyNyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzI4NDA0Njg0LCJleHAiOjE3Mjg0MDgyODQsImlhdCI6MTcyODQwNDY4NCwianRpIjoiOWZkNWMyZGEtMGJjMC00ZTZmLTg5YTgtZGE0NzI0M2I1ZDA5IiwiZW1haWwiOiJhbnRvbmlvZ2VyYXJkaTEyM0BnbWFpbC5jb20ifQ.qXXUVKJo_h_z5cwJy8b8VlUK8hmPFLoWBSp7p4-8dfdathKWGCiDYccBIiU5Rb4JIOJOB-xcq3WIfV078eaC3nXdinKR9T5uc-2FxioCiXgHH9nyYALpBLWsZL_hjALEn4qlvxgSIIKViJ4Ij5tXFDN2pv_XRs0-AB7FiQ081exbGxEjdgamFCHdfczgeGIv0zN11OZKhFlUEKAAC0j7qKrIB8QpZ5AbxCg6tlUP6A-a3M4GIjAzJZYUxHwbc5a5YX7H7udY0xk9EAY3nJZ9oRE69JJOWteZ5zbDq8nzfOIgFM18hHMv3KlsLeG1g5JfB82DQVQGlv81DzeHcw7KQg`,
            'Content-Type': 'application/json'
        }
    };
    
    //const payload = JSON.stringify({ StockId: "ZHPLPqU8oOg24Q5aZDB1tA" , Email : "c4682428-d061-7058-ee72-afa1e9c8d6cb" });
    const payload = JSON.stringify({ StockId: user.StockId, Email: user.Email});
    let res = http.del(APIGatewayURL, payload , params);

    check(res, {
        'DELETE status was 200': (r) => r.status === 200,
    });
    console.log(res);
    console.log(`User: ${user.email_real}, Response: ${res.body}`); // Log della risposta per utente

    //elimina la stock da la lista dei stocks dell'utente e aggiorna la lista
    //user.stocksId = user.stocksId.splice(0, 1);

    
}