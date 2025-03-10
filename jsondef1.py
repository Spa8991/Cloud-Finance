import json

# Carica il file JSON
with open('StockIds.json') as f: #results.json su antonio
    data = json.load(f)

# Carica il file JSON
with open('authTokens_20.json') as f:
    data1 = json.load(f)

for x in data:
    for y in data1:
        if x["Email"] == y["cognitoUsername"]:
            x["email_real"] = y["email"]
            x["authToken"] = y["authToken"]
            break

#print(data[1])

with open('tutto1.json', 'w') as f:
    json.dump(data, f)
print("FINE")