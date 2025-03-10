import json

# Carica il file JSON
#file con tutti gli cognitoUsername e stockId (file StockidEmail.json)
with open('StockId_Email.json') as f:
    data = json.load(f)


# Carica il file JSON
#file con email, cognito username e authoken 
with open('authTokens_20.json') as f:
    data1 = json.load(f)

for x in data1:
    x["stocksId"] = []

print(type(data1[0]))
for d in data:
    for user in data1:
        if user["cognitoUsername"]==d["Email"]:
                user["stocksId"].append(d["StockId"])
                
#qua hai tutto, email, stockid, cognito username e authtoken
with open('json_merge.json', 'w') as f:
    json.dump(data1, f)



