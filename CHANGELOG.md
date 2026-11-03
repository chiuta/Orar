# Changelog — Orar

Format: SemVer MAJOR.MINOR.PATCH. Date: AAAA-LL-ZZ.

## 2.2.3 — 2026-11-03

- Nou (Etapa 6, suita cer–timp): **locația, ora și fusul orar comune** cu Eclipsa-2027, Bolta, Horizons, Universul Observabil 3D, ORARIUM, CLEPSIDRA și Orar (modul `fff-place`): butonul „📍 Locație” (formular, 38 de orașe, geolocalizare doar la cerere și cu acord explicit, plic `place/fff` prin fișier/clipboard/QR/link), panoul **„Astea se întâmplă deasupra ta mâine”** (Soare, Lună, planete, eclipse; calcul local, fără rețea) și **alertă la eclipsă**. Pe aceeași origine locația se propagă singură; între adrese diferite, printr-un link/plic (o apăsare). Vezi docs/SUITA-CER-TIMP.md în hub. Panoul apare în bara laterală; fusul de afișare urmează locația; eclipsa se poate adăuga în agendă.

## 2.2.2 — 2026-11-03

x

## 2.2.1 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.2.1 — 2026-11-02 (anterior: 2.2.0)

- Corecție legală (2026-11-02): 6 ianuarie (Boboteaza) și 7 ianuarie (Soborul Sf. Ioan Botezătorul) sunt zile de sărbătoare legală conform art. 139 alin. (1) Codul muncii, introduse prin Legea nr. 52/2023 (în vigoare din 9 martie 2023); le-am adăugat în sărbătorile legale (8 limbi) și în test.

## 2.2.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 2.1.1 — 2026-10-31

- Ținte tactile: casetele de bifare din liste și din calendar la 1,5 rem (≥24 px, WCAG 2.5.8); coloana săptămânii din vederea lunară la 2 rem / 12 px. Fără alte schimbări de comportament.

## 2.1.0 — 2026-10-27

- **Notificări de sistem prin Service Worker, când acesta controlează pagina** (`registration.showNotification`; pe Android `new Notification()` nu este permis), cu rezervă `new Notification` când nu există Service Worker (de ex. din `file://`). Se aplică la notificarea de test și la alarmele care sună. Service Worker-ul existent (`sw.js`) nu a fost modificat în comportament (doar versiunea cache-ului).
- **Alarme cu aplicația închisă: NU sunt posibile și nu se pretinde contrariul.** Documentat (aplicație și README, 8 limbi) cu surse: Notification Triggers API nu se mai dezvoltă (Chrome), iar Periodic Background Sync funcționează doar la aplicații instalate, cu frecvență hotărâtă de browser; notificările push cer un server pe care Orar nu îl are. Alternativă documentată: exportul `.ics` scrie alarmele ca `VALARM`, iar calendarul telefonului/computerului le poate suna și cu Orar închis.
- README (8 limbi): „Stare: stabil”, „Offline: complet (alarmele și notificările doar cât aplicația este deschisă)”.
- Teste: nou `tests/notif-sw.test.mjs` (13 verificări: notificare prin SW, rezervă, 8 limbi); `tests/test.mjs` citește versiunea din `app.json`.

## 2.0.0 — 2026-10-26

„Găsește un interval” și invitații `.ics` (vezi README).
