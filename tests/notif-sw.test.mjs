// Teste Orar 2.1.0: notificări de sistem prin Service Worker (când controlează pagina), rezerva `new Notification`,
// textul despre alarmele cu aplicația închisă (8 limbi). Rulare: node tests/notif-sw.test.mjs
// Service Worker-ul cere context securizat: aplicația este servită de un server local (http://localhost).
import {createRequire} from 'module';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const require = createRequire('/opt/node-tools/package.json');
const {chromium} = require('playwright');
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const MIME = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.json': 'application/json'};
const srv = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('no'); }
  res.writeHead(200, {'Content-Type': MIME[path.extname(f)] || 'application/octet-stream'}); fs.createReadStream(f).pipe(res);
});
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = 'http://localhost:' + srv.address().port + '/';
let pass = 0, fail = 0;
function ok(name, cond, extra) { if (cond) { pass++; console.log('  ok   ' + name); } else { fail++; console.log('  FAIL ' + name + (extra !== undefined ? ' -> ' + JSON.stringify(extra) : '')); } }
const browser = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium'});

/* 1. cu Service Worker activ */
{
  const ctx = await browser.newContext({viewport: {width: 1280, height: 900}, locale: 'ro-RO'});
  await ctx.grantPermissions(['notifications'], {origin: base.slice(0, -1)});
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('dialog', d => { errs.push('dialog nativ'); d.dismiss(); });
  await page.goto(base); await page.waitForFunction(() => window.ORAR && ORAR.S);
  await page.waitForFunction(() => navigator.serviceWorker && navigator.serviceWorker.controller, null, {timeout: 15000}).catch(async () => { await page.reload(); await page.waitForFunction(() => navigator.serviceWorker.controller, null, {timeout: 15000}); });
  ok('Service Worker controlează pagina', await page.evaluate(() => !!navigator.serviceWorker.controller));
  await page.waitForFunction(() => window.ORAR && ORAR.S);
  await page.click('#b-set'); await page.waitForSelector('#s-notif', {state: 'visible'});
  await page.click('#s-notif'); await page.waitForTimeout(800);
  const n = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); const l = await r.getNotifications(); return {n: l.length, t: l.map(x => [x.title, x.body]), count: ORAR.S.notifs, st: document.getElementById('s-notifst').textContent}; });
  ok('notificarea de test a trecut prin Service Worker (getNotifications)', n.n === 1 && n.t[0][0] === 'Orar', n);
  ok('contor S.notifs incrementat', n.count === 1, n);
  ok('0 erori JS', errs.length === 0, errs);
  await ctx.close();
}

/* 2. fără Service Worker (file://): rezerva new Notification */
{
  const ctx = await browser.newContext({locale: 'ro-RO'});
  const page = await ctx.newPage();
  await page.addInitScript(() => { window.__n = []; window.Notification = class { constructor(t, o) { window.__n.push([t, o && o.body]); } static get permission() { return 'granted'; } static requestPermission() { return Promise.resolve('granted'); } }; });
  await page.goto('file://' + path.join(ROOT, 'index.html')); await page.waitForFunction(() => window.ORAR && ORAR.S);
  await page.evaluate(() => document.getElementById('s-notif').click());
  await page.waitForTimeout(300);
  const r = await page.evaluate(() => ({n: window.__n, c: ORAR.S.notifs, sw: !!navigator.serviceWorker && !!navigator.serviceWorker.controller}));
  ok('fără SW: rezerva new Notification funcționează', r.n.length === 1 && r.n[0][0] === 'Orar' && r.c === 1 && !r.sw, r);
  await ctx.close();
}

/* 3. texte în 8 limbi */
{
  const ctx = await browser.newContext({locale: 'ro-RO'});
  const page = await ctx.newPage();
  await page.goto('file://' + path.join(ROOT, 'index.html')); await page.waitForFunction(() => window.ORAR && ORAR.S);
    const keys = await page.evaluate(() => { const o = {}; for (const l of ['ro', 'en', 'fr', 'it', 'es', 'pt', 'hu', 'de']) { const sel = document.getElementById('lang'); sel.value = l; sel.dispatchEvent(new Event('change', {bubbles: true})); o[l] = [document.querySelector('[data-i18n=alarm_closed_tip]')?.textContent || '', document.querySelector('[data-i18n=notif_sw]')?.textContent || '']; } return o; });
  for (const [l, v] of Object.entries(keys)) ok(l + ': textele despre alarme cu aplicația închisă și notificări SW sunt completate', v[0].length > 80 && v[1].length > 60 && /\.ics/.test(v[0]), v.map(x => x.slice(0, 30)));
  await ctx.close();
}
await browser.close(); srv.close();
console.log(`\n${pass} reușite, ${fail} eșuate`); process.exit(fail ? 1 : 0);
