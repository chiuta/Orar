# Changelog — Orar

Format: SemVer MAJOR.MINOR.PATCH. Date: AAAA-LL-ZZ.

## 2.1.1 — 2026-10-31

- Ținte tactile: casetele de bifare din liste și din calendar la 1,5 rem (≥24 px, WCAG 2.5.8); coloana săptămânii din vederea lunară la 2 rem / 12 px. Fără alte schimbări de comportament.

## 2.1.0 — 2026-10-27

- **Notificări de sistem prin Service Worker, când acesta controlează pagina** (`registration.showNotification`; pe Android `new Notification()` nu este permis), cu rezervă `new Notification` când nu există Service Worker (de ex. din `file://`). Se aplică la notificarea de test și la alarmele care sună. Service Worker-ul existent (`sw.js`) nu a fost modificat în comportament (doar versiunea cache-ului).
- **Alarme cu aplicația închisă: NU sunt posibile și nu se pretinde contrariul.** Documentat (aplicație și README, 8 limbi) cu surse: Notification Triggers API nu se mai dezvoltă (Chrome), iar Periodic Background Sync funcționează doar la aplicații instalate, cu frecvență hotărâtă de browser; notificările push cer un server pe care Orar nu îl are. Alternativă documentată: exportul `.ics` scrie alarmele ca `VALARM`, iar calendarul telefonului/computerului le poate suna și cu Orar închis.
- README (8 limbi): „Stare: stabil”, „Offline: complet (alarmele și notificările doar cât aplicația este deschisă)”.
- Teste: nou `tests/notif-sw.test.mjs` (13 verificări: notificare prin SW, rezervă, 8 limbi); `tests/test.mjs` citește versiunea din `app.json`.

## 2.0.0 — 2026-10-26

„Găsește un interval” și invitații `.ics` (vezi README).
