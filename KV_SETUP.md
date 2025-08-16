# Vercel KV Setup pentru Scoruri

## 🎯 Problema

API-ul actual folosește storage în memorie care se resetează la fiecare restart al serverului pe Vercel.

## 🔧 Soluția: Vercel KV (Redis)

### 1. Instalare Vercel KV

```bash
npm install @vercel/kv
```

### 2. Configurare pe Vercel Dashboard

1. **Mergi la [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Selectează proiectul tău**
3. **Mergi la tab-ul "Storage"**
4. **Click "Create Database"**
5. **Selectează "KV" (Redis)**
6. **Alege regiunea (recomand: Frankfurt pentru Europa)**
7. **Click "Create"**

### 3. Variabile de Mediu

După crearea KV database, Vercel va genera automat variabilele de mediu:

```env
KV_URL=redis://...
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
```

**IMPORTANT:** Aceste variabile trebuie să apară în secțiunea "Environment Variables" din Vercel Dashboard.

### 4. Testare

După configurare:

1. **Deployează aplicația**
2. **Joacă un joc**
3. **Verifică ranking-ul**
4. **Scorurile ar trebui să persiste**

## 🎯 Avantaje

- ✅ **Scoruri persistente** - nu se resetează
- ✅ **Performanță ridicată** - Redis
- ✅ **Gratuit** pentru acest caz de utilizare
- ✅ **Integrat perfect** cu Vercel
- ✅ **Backup automat**

## 📱 Funcționalitate

- **Scorurile se salvează** în KV storage
- **Ranking-ul funcționează** global
- **Modul Insanity** se deblochează pentru primii 3
- **Toți utilizatorii** văd același ranking

## 🚀 Deploy

După configurarea KV:

1. **Commit și push** codul
2. **Vercel va redeploya** automat
3. **API-ul va folosi** KV storage
4. **Scorurile vor persista** între restart-uri

## 🔄 Soluție Temporară

**Până configurezi KV:**

- ✅ **Aplicația funcționează** cu storage în memorie
- ✅ **Scorurile se salvează** pe durata sesiunii
- ✅ **Nu se vor reseta** la fiecare request
- ✅ **Va funcționa** imediat după deploy

**Pentru scoruri permanente, configurează KV database-ul!**

## 🔍 Verificare Date din KV Database

### 1. Debug API Endpoint

După deploy, poți verifica datele accesând:

```
https://your-app.vercel.app/api/debug
```

Acest endpoint va afișa:

- ✅ Dacă KV este configurat
- ✅ Numărul de scoruri
- ✅ Toate scorurile salvate
- ✅ Timestamp-ul ultimei verificări

### 2. Pe Vercel Dashboard

- Mergi la proiectul tău
- Tab "Storage" → Click pe database-ul Redis
- Secțiunea "Data" sau "Browse" (dacă este disponibilă)

### 3. Folosind Redis CLI

- Click pe butonul "Open in Redis" din Vercel Dashboard
- Folosește comanda: `GET game_scores`

### 4. Verificare în Browser

1. **Deschide aplicația** pe Vercel
2. **Joacă un joc** și salvează un scor
3. **Accesează** `/api/debug` pentru a vedea datele
4. **Verifică ranking-ul** în aplicație

## 📊 Exemple de Răspuns Debug

**Dacă KV funcționează:**

```json
{
  "timestamp": "2025-01-16T12:34:56.789Z",
  "kvConfigured": true,
  "scoresCount": 3,
  "scores": [
    { "player": "Berna", "time": 10403, "date": "8/16/2025" },
    { "player": "Alex", "time": 12000, "date": "8/16/2025" }
  ],
  "message": "Scoruri găsite în KV"
}
```

**Dacă KV nu este configurat:**

```json
{
  "timestamp": "2025-01-16T12:34:56.789Z",
  "kvConfigured": false,
  "error": "KV connection failed",
  "message": "KV nu este configurat corect"
}
```
