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
