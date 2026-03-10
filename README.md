## Toiminnallisuudet
Käyttäjänhallinta: Sisäänkirjautuminen ja tilin poistaminen
Median hallinta: Julkaisujen selaus, omien postausten muokkaus
Vuorovaikutus: Tykkäysten lisääminen ja poistaminen lisääksi käyttäjä voi luoda uusia julkaisuja, 
muokata omien julkaisujensa otsikoita ja kuvauksia sekä poistaa niitä.

## Tekniikat
Front-end: React, TypeScript, Vite 
Tilanhallinta: Zustand 
Tyylittely: Tailwind CSS,
Backend: Metropolia REST API

## Kuvat
Etusivu: ![Etusivu](public/screenshots/main.png)
Profiili: ![Profiili](public/screenshots/profil.png)
Muokkaustila: ![Muokkaus](public/screenshots/edit.png)

## Käyttöönotto
1. Asenna: npm install
2. Konfiguroi .env tiedosto API-osoitteilla
3. Käynnistä sovelus: npm run dev

## Back-end-API:
https://media2.edu.metropolia.fi/media-api/api/v1

## API-dokumentaatioon:
[https://media2.edu.metropolia.fi/media-api/](https://media2.edu.metropolia.fi/media-api/)


## Tekoäly
Logiikan toteutus: kuten rinnakkaiset API-kutsut käyttäjänimien noutamiseen ja 
kaksivaiheinen tiedoston latausprosessi, on tekoälyn avustuksella, lisäksi virheiden korjaamisesta.
