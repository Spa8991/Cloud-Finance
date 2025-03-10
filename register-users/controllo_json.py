import json 
import pandas as pd
import matplotlib.pyplot as plt
# Initialize a list to store the requests per second for each time point
all_requests = []

# Loop through each of the 15 JSON files
for i in range(1, 16):
    # Load the JSON file
    with open('result_def' + str(i) + '.json') as f:
        # Initialize a list to store the requests per second for this file
        requests = []
        for line in f:
            data = json.loads(line)
            if data['type'] == 'Point' and "vus" == data["metric"]:
                requests.append(data['data']['value'])

    # Calculate the requests per second for this file
    df = pd.DataFrame(requests, columns=['VUs'])
    df['Time'] = range(len(df))

    # Add the requests per second for this file to the all_requests list
    all_requests.append(df['VUs'].values)

# Calculate the mean requests per second across all files
max_len = max(len(x) for x in all_requests)
mean_requests = [0.0] * max_len

for requests in all_requests:
    for i in range(max_len):
        if i < len(requests):
            mean_requests[i] += requests[i]

mean_requests = [x / len(all_requests) for x in mean_requests]

# Create a DataFrame to store the mean requests per second
mean_df = pd.DataFrame(mean_requests, columns=['VUs'])
mean_df['Time'] = range(len(mean_df))

# Plot the mean requests per second
plt.figure(figsize=(12, 6))
plt.plot(mean_df['Time'], mean_df['VUs'], marker='o')
plt.title('Mean Requests per Second')
plt.xlabel('Time')
plt.ylabel('Requests per Second')
plt.grid(True)
plt.show()





import json 
import pandas as pd
import matplotlib.pyplot as plt


# Inizializza le variabili per calcolare le metriche
invocations = 0
error_count = 0
waiting_times  = [] #sarebbe la duration 
concurrent_executions = []

# Lista per tenere traccia delle richieste con il loro timestamp
requests_timestamps = []

# Leggi il file JSON
#with open('results.json') as f:
#with open('results_put_3000.json') as f:
for i in range(1,16):
    print(i)
    # Inizializza le variabili per calcolare le metriche
    invocations = 0
    error_count = 0
    waiting_times  = [] #sarebbe la duration 
    concurrent_executions = []

    # Lista per tenere traccia delle richieste con il loro timestamp
    requests_timestamps = []
    with open('result_def' + str(i) + '.json') as f:
        for line in f:
            data = json.loads(line)

            # Conta le invocazioni
            if data['type'] == 'Point' and data['metric'] == 'http_reqs':
                invocations += data['data']['value']
                # Salva il timestamp e il numero di richieste
                requests_timestamps.append((data['data']['time'], data['data']['value']))

            # Conta le esecuzioni concorrenti
            if data['type'] == 'Point' and data['metric'] == 'vus':
                concurrent_executions.append(data['data']['value'])

            # Raccogli le durate delle richieste
            if data['type'] == 'Point' and data['metric'] == 'http_req_waiting':
                waiting_times.append(data['data']['value'])

            # Conta gli errori basati sullo status HTTP
            if data['type'] == 'Point' and data['metric'] == 'http_reqs':
                if not data['data']['tags']['status'].startswith('2'):
                    error_count += data['data']['value']

    # Calcola il tasso di successo
    success_count = invocations - error_count
    success_rate = (success_count / invocations) * 100 if invocations > 0 else 0

    # Calcola statistiche di durata
    avg_waiting_time = sum(waiting_times) / len(waiting_times) if waiting_times else 0
    min_waiting_time = min(waiting_times) if waiting_times else 0
    max_waiting_time = max(waiting_times) if waiting_times else 0

    # Calcola le esecuzioni concorrenti medie
    max_concurrent_executions = max(concurrent_executions) if concurrent_executions else 0

    # Stampa le metriche calcolate
    print("Invocations:", invocations)
    print("Waiting Time - Avg:", avg_waiting_time, "ms, Min:", min_waiting_time, "ms, Max:", max_waiting_time, "ms")
    print("Error Count:", error_count)
    print("Success Rate: {:.2f}%".format(success_rate))
    print("Max Concurrent Executions:", max_concurrent_executions)


    """l=[]
    for i in range(1,16):
        with open('result_def' + str(i) + '.json') as f:
            for line in f:
                data = json.loads(line) 
                #print(data, type(data))
                if data['type'] == 'Point' and "vus"== data["metric"]:
                    l.append(data['data']['value'])


    # Crea un DataFrame con i valori estratti
    df = pd.DataFrame(l, columns=['VUs'])

    # Crea un grafico a linee dei valori di durata delle richieste
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['VUs'], marker='o')
    plt.title('VUs')
    plt.xlabel('Index')
    plt.ylabel('Durata (ms)')
    plt.grid(True)
    plt.show()"""


    # Calcola le richieste per secondo
    timestamps, requests = zip(*requests_timestamps)
    df = pd.DataFrame({'Timestamp': pd.to_datetime(timestamps), 'Requests': requests})

    # Raggruppa le richieste per secondo
    df.set_index('Timestamp', inplace=True)
    df = df.resample('1S').sum().fillna(0)  # Raggruppa e somma le richieste al secondo

    # Crea un grafico a linee dei valori di durata delle richieste
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['Requests'], marker='o')
    plt.title('Requests per Second')
    plt.xlabel('Time')
    plt.ylabel('Requests per Second')
    plt.grid(True)
    plt.show()




