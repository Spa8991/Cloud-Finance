import json


def generate_users(num_users):
    """Genera un dizionario con email e password casuali"""
    users = []
    for x in range(num_users):
        email = 'user' + str(x) + '@example.com'
        password = 'Password1!'
        users.append({
            'email': email,
            'password': password
        })
    return users

def save_users_to_json(users, filename):
    """Salva la lista di utenti in un file JSON"""
    with open(filename, 'w') as file:
        json.dump(users, file, indent=2)
    print(f"Users saved to {filename}")

# Genera 10 utenti e salva in 'users.json'
num_users = 3000
users = generate_users(num_users)
save_users_to_json(users, 'users.json')
