const { CognitoIdentityProviderClient, SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
// Configura il client Cognito
const client = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Cambia con la tua regione

const userPoolId = process.env.userPoolId; // Cambia con il tuo User Pool ID
const clientId = process.env.userPoolId.clientId; // Cambia con il tuo App Client ID

// Funzione per registrare un utente
async function registerUser(email, password) {
    const params = {
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
            {
                Name: 'email',
                Value: email
            }
        ]
    };

    try {
        const command = new SignUpCommand(params);
        await client.send(command);
        console.log(`User ${email} registered successfully.`);
    } catch (error) {
        console.error(`Error registering user ${email}:`, error);
    }
}

// Funzione principale per caricare utenti e registrarli
(async () => {
    const filePath = path.join(__dirname, 'users.json');
    
    // Leggi e parse il file JSON
    const data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);
    
    console.log(`Loaded ${users.length} users from ${filePath}`);

    // Registra ciascun utente
    for (const user of users) {
        const { email, password } = user;
        await registerUser(email, password);
        // Aggiungi un delay per evitare di sovraccaricare Cognito
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attesa di 1 secondo tra le richieste
    }
})();
