# 🏆 Sistem de Scoruri - API Server

## 📋 Descriere

Sistemul de scoruri pentru jocul de baloane a fost migrat de la localStorage la un API server-side pentru a permite partajarea scorurilor între toți utilizatorii.

## 🚀 Funcționalități

### **API Endpoints:**

#### **GET /api/scores**

- **Descriere:** Returnează toate scorurile salvate
- **Răspuns:** `{ scores: [...] }`
- **Exemplu:**

```javascript
fetch("/api/scores")
  .then((response) => response.json())
  .then((data) => console.log(data.scores));
```

#### **POST /api/scores**

- **Descriere:** Salvează un scor nou
- **Body:** `{ player: "Nume", time: 12345, date: "23.12.2024" }`
- **Răspuns:** `{ success: true, scores: [...], message: "Score saved successfully" }`
- **Exemplu:**

```javascript
fetch("/api/scores", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    player: "Alex",
    time: 15000,
    date: "23.12.2024",
  }),
});
```

#### **DELETE /api/scores**

- **Descriere:** Șterge toate scorurile
- **Răspuns:** `{ success: true, message: "All scores cleared successfully" }`
- **Exemplu:**

```javascript
fetch("/api/scores", { method: "DELETE" });
```

## 💾 Stocare

### **Fișier de date:**

- **Locație:** `data/scores.json`
- **Format:** JSON array cu obiecte scor
- **Structură:**

```json
[
  {
    "player": "Numele jucătorului",
    "time": 12345,
    "date": "23.12.2024"
  }
]
```

### **Caracteristici:**

- ✅ **Top 10 scoruri** se păstrează automat
- ✅ **Sortare** după timp (ascending)
- ✅ **Persistență** pe server
- ✅ **Partajare** între toți utilizatorii

## 🔧 Implementare

### **În pagina de joc (`/game`):**

- Scorurile se încarcă la pornirea paginii
- Scorul nou se salvează la finalizarea jocului
- Ranking-ul se actualizează automat

### **În modalul de ranking:**

- Scorurile se încarcă la deschiderea modalului
- Butonul de ștergere folosește API-ul DELETE
- Actualizare în timp real

## 🌐 Deployment

### **Pentru server propriu:**

1. **Deploy aplicația** pe serverul tău
2. **Creează directorul `data/`** pe server
3. **Asigură-te că serverul** are permisiuni de scriere
4. **Scorurile se vor salva** automat în `data/scores.json`

### **Pentru Vercel/Netlify:**

- Sistemul funcționează cu fișiere temporare
- Pentru persistență completă, folosește o bază de date externă

## 🔒 Securitate

- ✅ **Validare** a datelor de intrare
- ✅ **Gestionarea erorilor** pentru toate operațiunile
- ✅ **Limitare** la top 10 scoruri
- ✅ **Sanitizare** a numelor de jucători

## 📊 Avantaje

1. **Scoruri globale** - toți utilizatorii văd același ranking
2. **Persistență** - scorurile nu se pierd la refresh
3. **Timp real** - actualizări instantanee
4. **Scalabilitate** - ușor de extins cu bază de date
