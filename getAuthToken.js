const { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
const crypto = require('crypto');
const fs = require('fs');
//aggiunto dopo
const jwt = require('jsonwebtoken'); // Libreria per decodificare il token JWT
require('dotenv').config();
// Configura il client Cognito
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Cambia con la tua regione

const userPoolId = process.env.userPoolId; // Cambia con il tuo User Pool ID
const clientId = process.env.userPoolId.clientId; // Cambia con il tuo App Client ID



async function authenticateUser(username, password) {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password
        }
    };

    try {
        const command = new InitiateAuthCommand(params);
        const response = await client.send(command);
        const authToken = response.AuthenticationResult.IdToken;

        //aggiunto dopo
        // Decodifica l'IdToken per ottenere i claims
        const decodedToken = jwt.decode(authToken);
        // Estrai il Cognito username dal token
        const cognitoUsername = decodedToken['cognito:username'];
        //fine aggiunto dopo

        console.log(`User ${username} authenticated successfully.`);
        return {authToken, cognitoUsername};
        //return authToken;
    } catch (error) {
        console.error(`Error authenticating user ${username}:`, error);
        return null;
    }
}

// Funzione principale per leggere gli utenti, autenticare e salvare i token
(async () => {
    try {
        // Leggi gli utenti dal file users.json
        //const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
        
        const users = JSON.parse(fs.readFileSync('users_20.json', 'utf-8'));
        let authData = [];
        for (let user of users) {
            const { email, password } = user;
            //aggiunto dopo, prima era 
            //const authToken = await authenticateUser(email, password);
            const {authToken, cognitoUsername} = await authenticateUser(email, password);
            //fine aggiunto dopo
            if (authToken) {
                //aggiunto dopo, prima era 
                //authData.push({ email, authToken });
                authData.push({ email, cognitoUsername, authToken });
                //fine aggiunto dopo
            }
        }

        // Salva i token di autorizzazione in un file JSON
        /*fs.writeFileSync('authTokens_3000.json', JSON.stringify(authData, null, 2));
        console.log('Authorization tokens saved to authTokens.json');*/

        fs.writeFileSync('authTokens_20.json', JSON.stringify(authData, null, 2));
        console.log('Authorization tokens saved to authTokens_20.json');
    } catch (error) {
        console.error('Error processing users:', error);
    }
})();

