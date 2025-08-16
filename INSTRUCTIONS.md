# 🎉 Pagină de Invitație pentru Ziua de Naștere a Selen

## 📸 Instrucțiuni pentru adăugarea imaginii

### Cum să adaugi imaginea fiicei tale:

#### 1. Adaugă imaginea în folderul `public/`

- Pune imaginea fiicei tale în folderul `public/` din proiect
- Recomand să o numești `selen.jpg` sau `selen.png`

#### 2. Modifică codul pentru a afișa imaginea

În fișierul `src/app/page.js`, găsește secțiunea:

```jsx
{/* Daughter's Image */}
<div className={styles.daughterImage}>
  <div className={styles.imagePlaceholder}>
    <p>📸 Imaginea Selen aici!</p>
    <p className={styles.imageInstructions}>
      Adaugă imaginea Selen în folderul public/ și schimbă numele
      fișierului în cod
    </p>
  </div>
</div>
```

Și înlocuiește-o cu:

```jsx
{/* Daughter's Image */}
<div className={styles.daughterImage}>
  <img
    src="/selen.jpg"
    alt="Selen - Ziua de naștere"
    className={styles.daughterPhoto}
  />
</div>
```

#### 3. Adaugă stilurile CSS pentru imagine

În fișierul `src/app/page.module.css`, adaugă:

```css
.daughterPhoto {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid #ff6b6b;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@media (max-width: 768px) {
  .daughterPhoto {
    width: 250px;
    height: 250px;
  }
}

@media (max-width: 480px) {
  .daughterPhoto {
    width: 200px;
    height: 200px;
  }
}
```

## 🎵 Despre muzica de fundal

Muzica se va reda când:
- Se apasă butonul de muzică (🎵) din dreapta sus
- Se poate opri/pornește cu același buton

**Funcționalitate:**
- **Web Audio API:** Cântecul "La mulți ani" generat programatic
- **Fallback:** Dacă fișierul audio nu se poate reda, se folosește doar Web Audio API
- **Erori gestionate:** Nu mai apar erori în consolă

**Notă:** Muzica este redată prin Web Audio API pentru o experiență mai bună și fără probleme de compatibilitate.

## 🌟 Caracteristici ale paginii de invitație:

### 🇷🇴 **Pagină de invitație completă:**

- **Titlu:** "Invitație la ziua de naștere!"
- **Detalii complete:** Data, ora, locația, informații despre cadouri
- **Secțiune RSVP:** Butoane pentru confirmarea prezenței
- **Informații de contact:** Telefon, email, adresa
- **Mesaj personalizat:** Pentru invitați

### 🎵 **Muzică de fundal:**

- Cântec românesc "La mulți ani" ca muzică de fundal
- Control prin butonul din dreapta sus
- Redare doar audio (fără video)

### 📸 **Secțiune pentru imagine:**

- Loc special pentru imaginea Selen
- Design circular cu bordură colorată
- Animații și efecte vizuale

### 🎮 **Interactivitate:**

- Toate elementele răspund la interacțiune
- Efecte sonore pentru baloane și tort
- Confetti colorat la apăsarea tortului
- Butoane RSVP interactive

## 🎨 Personalizări pentru invitație:

### Schimbarea detaliilor invitației:

În fișierul `src/app/page.js`, modifică:

```jsx
<div className={styles.detail}>
  <span className={styles.detailIcon}>📅</span>
  <div>
    <strong>Data:</strong>
    <p>15 Decembrie 2024</p> {/* Schimbă data aici */}
  </div>
</div>
```

### Schimbarea informațiilor de contact:

```jsx
<div className={styles.contactItem}>
  <span className={styles.contactIcon}>📱</span>
  <p><strong>Telefon:</strong> +40 123 456 789</p> {/* Schimbă telefonul */}
</div>
```

### Schimbarea culorilor:

Modifică valorile din `src/app/page.module.css`:

```css
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Schimbarea fontului:

În `src/app/globals.css`:

```css
body {
  font-family: "Comic Sans MS", cursive, sans-serif;
}
```

## 📱 Responsive Design:

Pagina este optimizată pentru:
- Desktop
- Tablet
- Telefon mobil
- Toate browserele moderne

## 🎊 Rezultat final:

O pagină de invitație completă în română cu:
- Detalii complete ale evenimentului
- Secțiune RSVP interactivă
- Imaginea Selen
- Muzică de fundal românească
- Toate textele în română
- Animații și efecte interactive
- Design responsive
- Informații de contact

Perfectă pentru trimiterea invitațiilor la ziua de naștere a Selen! 🎂🎈🎁🎉

## 📤 Cum să trimiți invitația:

1. **Deploy pe Vercel/Netlify** pentru a obține un link public
2. **Trimite linkul** invitaților prin email, WhatsApp, etc.
3. **Invității pot accesa** pagina de pe orice dispozitiv
4. **Pot confirma prezența** prin butoanele RSVP

## 🔧 Funcționalități tehnice:

- **Muzică de fundal:** Redare audio din YouTube
- **Animații CSS:** Efecte vizuale fluide
- **Responsive:** Adaptare automată la toate dispozitivele
- **Interactivitate:** Efecte la hover și click
- **Performanță:** Optimizată pentru încărcare rapidă
