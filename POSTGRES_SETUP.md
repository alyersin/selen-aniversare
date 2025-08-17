# 🐘 Vercel Postgres Setup pentru Selen Aniversare

## 📋 Pași pentru configurarea PostgreSQL pe Vercel

### 1. **Creează baza de date PostgreSQL**

- Mergi în **Vercel Dashboard**
- Navighează la **Storage** → **Create Database**
- Alege **Postgres**
- Denumește-l: `selen-game-scores`
- Alege regiunea: **Frankfurt** (pentru Europa)
- Click **Create**

### 2. **Vercel va configura automat variabilele de mediu**

După crearea bazei de date, Vercel va adăuga automat:

- `POSTGRES_URL` - Connection string complet
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`

### 3. **Verifică variabilele de mediu**

- Mergi la **Settings** → **Environment Variables**
- Ar trebui să vezi toate variabilele PostgreSQL configurate automat
- Dacă nu le vezi, click **Redeploy** pe proiect

### 4. **Deployează aplicația**

```bash
git add .
git commit -m "Add PostgreSQL support"
git push
```

### 5. **Testează conexiunea**

După deploy, accesează: `https://your-app.vercel.app/api/debug`

Ar trebui să vezi:

```json
{
  "postgresConfigured": true,
  "scoreCount": 0,
  "scores": [],
  "error": null
}
```

## 🔧 Avantajele PostgreSQL față de KV

✅ **Mai simplu de configurat** - Vercel configurează automat toate variabilele
✅ **Interogări SQL** - Poți face query-uri complexe
✅ **Structură de date** - Tabel cu coloane definite
✅ **Backup automat** - Vercel face backup-uri
✅ **Monitoring** - Poți vedea query-urile în dashboard

## 🚨 Troubleshooting

### Problema: "Postgres not configured"

**Soluție:** Verifică că ai creat baza de date și că variabilele de mediu sunt setate.

### Problema: "Connection failed"

**Soluție:** Așteaptă 2-3 minute după crearea bazei de date pentru ca Vercel să o configureze.

### Problema: "Table doesn't exist"

**Soluție:** Prima dată când accesezi API-ul, tabelul va fi creat automat.

## 📊 Structura tabelului

```sql
CREATE TABLE game_scores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  game_mode VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Următorii pași

1. **Creează baza de date** în Vercel Dashboard
2. **Deployează** aplicația
3. **Testează** cu `/api/debug`
4. **Joacă un joc** și verifică că scorurile se salvează
5. **Verifică ranking-ul** să apară corect
