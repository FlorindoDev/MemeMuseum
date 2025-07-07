# MemeMuseum

🚀 **MemeMuseum - Guida all’Avvio**

Benvenuto su **MemeMuseum**!  
Un’applicazione full-stack per condividere, votare e commentare meme.  
Segui questi semplici passi per avviare il progetto in locale tramite Docker Compose.

---

## 1. Prerequisiti

- [Docker](https://www.docker.com/get-started) installato
- [Docker Compose](https://docs.docker.com/compose/) installato

---

## 2. Configurazione `.env`

Crea/modifica il file `.env` nella cartella `back_end`.  
Esempio di variabili richieste per il backend (`back_end/.env`):

```
DB_CONNECTION_URI = "postgres://db:db@meme_db:5432/meme_database"
DIALECT = "postgres"
TOKEN_SECRET = "V3RY_S3CR37_T0K3N"
END_POINT_ALLOWED = "orgin allowed"

# Google Cloud Storage (per upload immagini)
GOOGLE_APPLICATION_CREDENTIALS="path/to/credentials.json"
BUCKET_NAME="name_bucket"
```

**Nota:**  
- Sostituisci i valori con quelli reali del tuo ambiente.

---

## 3. Avvio con Docker Compose

Assicurati di essere nella root del progetto e lancia:

```sh
docker compose up -d --build
```

Questo comando:
- Avvia il backend Node.js (porta 3000)
- Avvia il frontend Angular (porta 4200)
- Avvia il database PostgreSQL (porta 5432)

---

## 4. Accesso all’App

- **Frontend:** [http://localhost:4200](http://localhost:4200)
- **Backend API:** [http://localhost:3000](http://localhost:3000)
- **Swagger API Docs:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 5. Funzionalità Principali

- Registrazione/Login
- Upload Meme
- Votazione e Commenti
- Ricerca per tag
- Profilo utente con upload immagine

---

## 6. Tips & Troubleshooting

- Se hai errori di connessione al DB, controlla la stringa `DB_CONNECTION_URI`.
- Per l’upload immagini, verifica che il bucket Google Cloud sia configurato e accessibile.
- Puoi personalizzare le variabili `.env` per adattare l’app al tuo ambiente.

---

## 7. Contribuisci!

Pull request e segnalazioni sono benvenute!  
Per domande o problemi, apri una [issue](https://github.com/FlorindoDev/MemeMuseum/issues).

---

Buon divertimento con MemeMuseum!