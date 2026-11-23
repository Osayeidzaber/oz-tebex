// Renders every OZ template with mock Tebex data using twig.js.
// Usage: node tools/render.js <themeDir> <outDir>
const fs = require('fs');
const path = require('path');
const Twig = require('twig');

const themeDir = path.resolve(process.argv[2]);
const outDir = path.resolve(process.argv[3]);
const tpl = path.join(themeDir, 'templates');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(path.join(themeDir, 'assets'))) fs.copyFileSync(path.join(themeDir, 'assets', f), path.join(outDir, f));

Twig.cache(false);
const schema = JSON.parse(fs.readFileSync(path.join(themeDir, 'schema.json'), 'utf8'));
const defaults = {};
schema.config.forEach(s => s.options.forEach(o => { defaults[o.id] = o.default; }));

let cfg = {}, curPath = '/';
Twig.extendFunction('config', id => (id in cfg ? cfg[id] : defaults[id]) ?? '');
Twig.extendFunction('asset', f => f);
Twig.extendFunction('__', s => s);
Twig.extendFunction('_p', s => s);
Twig.extendFunction('path', () => 'https://demo.tebex.io' + curPath);
Twig.extendFunction('query', () => '');
Twig.extendFilter('money', v => Number(v).toFixed(2));

const pkg = (id, name, price, extra = {}) => ({ id, name, price: price.toFixed(2), image: { url: '' }, discount: { applied: false }, quantity: 0, purchasable: true, category: 2, ...extra });
const ranks = [pkg(11, 'VIP', 4.99), pkg(12, 'VIP+', 7.99), pkg(13, 'MVP', 11.99, { discount: { applied: true, original: 14.99, percentage: 20 } }), pkg(14, 'MVP+', 19.99)];
const keys = [pkg(21, 'Wooden key', 0.75), pkg(22, 'Silver key', 1.5), pkg(23, 'Golden key', 2.2, { quantity: 1 }), pkg(24, 'Emerald key', 2.8, { discount: { applied: true, original: 5.6, percentage: 50 } }), pkg(25, 'Void key', 4, { purchasable: false })];

const store = { name: 'Frostvale', currency: 'USD', css: '', logo: '', favicon: '', noLogin: false,
  pages: [{ id: 7, name: 'Staff', slug: 'staff' }, { id: 8, name: 'Rules', slug: 'rules' }],
  categories: [{ id: 1, name: 'Ranks', subcategories: [] }, { id: 2, name: 'Keys', subcategories: [{ id: 5, name: 'Seasonal keys' }] }, { id: 3, name: 'Coins' }, { id: 4, name: 'Cosmetics' }] };
const basket = { ign: 'Notch_', currency: 'USD', price: '38.49', coupons: [],
  packages: [{ id: 13, name: 'MVP', price: '11.99', quantity: 1 }, { id: 23, name: 'Golden key', price: '2.20', quantity: 10 }] };
const page = { title: '', message: { display: false } };

function renderModules() {
  const mods = [
    ['module.goal.html', { module: { header: 'Server goal', bar: { style: 'striped', animated: false }, displayAmount: true, total: 80, target: 200, percentage: 40 } }],
    ['module.communitygoal.html', { module: { communitygoal: { image: '', repeatable: true, times_achieved: 1, description: '<p>Unlocks the Frostlands boss.</p>' }, bar: { style: 'animated' }, displayAmount: true, total: 946, target: 1000, percentage: 94.6 } }],
    ['module.topdonator.html', { module: { header: '', donor: true, ign: 'Luxen2017', displayAmount: true, total: 41.99, period: 'monthly' } }],
    ['module.payments.html', { module: { header: '', payments: [{ ign: 'Fratage', name: 'MVP', price: 11.99, currency: 'USD' }, { ign: 'willo_mc', name: 'Coins', price: 19.99, currency: 'USD' }], displayPackage: false, displayPrice: false } }],
    ['module.featuredpackage.html', { module: { header: '', package: ranks[2] } }],
    ['module.serverstatus.html', { module: { header: '', online: true, ip: 'play.frostvale.net', port: 25565, players: { online: 412, max: 1000 } } }],
    ['module.textbox.html', { module: { header: 'Vote daily', text: '<p>Vote on 5 sites for a free key.</p>' } }],
    ['module.giftcardbalance.html', { module: { header: '' }, search: true, giftcard: { card_number: 'XXXX-1234', void: false, remaining_balance: 12.5 } }]
  ];
  return mods.map(([f, d]) => render(f, { ...d, basket, store })).join('\n');
}

function render(file, ctx) {
  // Email templates extend their own email/layout.html, so resolve them inside email/.
  const base = file.startsWith('email/') ? path.join(tpl, 'email') : tpl;
  const t = Twig.twig({ path: path.join(tpl, file), async: false, rethrow: true, base });
  return t.render(ctx);
}

const pages = [
  ['index.html', 'index.html', '/', { description: '<p>Ranks, keys and cosmetics for every gamemode.</p>' }, {}],
  ['category.html', 'category-grid.html', '/category/2', { id: 2, name: 'Keys', displayType: 'grid', description: '<p>Open crates at /warp crates.</p>', packages: keys, slug: 'keys' }, { 'quantity-categories': 'Keys', 'package-icons': 'Wooden key=key-iron, Silver key=key-iron\nGolden key=key-gold\nEmerald key=key-emerald\nVoid key=key-void', 'category-icons': 'Ranks=crown-gold, Keys=key-diamond, Coins=coins-gold, Cosmetics=party-hat' }],
  ['category.html', 'category-list.html', '/category/3', { id: 3, name: 'Coins', displayType: 'list', description: '', packages: keys.slice(0, 3), slug: 'coins' }, {}],
  ['category.html', 'category-ranks.html', '/category/1', { id: 1, name: 'Ranks', displayType: 'grid', description: '', packages: ranks, slug: 'ranks' }, { 'rank-category': 'Ranks', 'rank-highlight': 'MVP', 'rank-table': 'Chat prefix | [VIP] | [VIP+] | [MVP] | [MVP+]\nHomes | 2 | 4 | 6 | 10\nNo chat cooldown | no | yes | yes | yes\nQueue priority | no | no | no | yes' }],
  ['category.html', 'category-empty.html', '/category/4', { id: 4, name: 'Cosmetics', displayType: 'grid', description: '', packages: [], slug: 'cosmetics' }, {}],
  ['package.html', 'package.html', '/package/13', { package: { ...ranks[2], description: '<ul><li>Gold prefix</li><li>6 homes</li></ul>', media: [{ type: 'image', url: 'https://mc-heads.net/body/Notch/200' }, { type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }] } }, {}],
  ['package.html', 'package-root.html', '/package/11', { ...ranks[0], description: '<p>Root-level fields.</p>' }, {}],
  ['username.html', 'login.html', '/login', { external: false, provider: '', url: '' }, {}],
  ['username.html', 'login-external.html', '/login', { external: true, provider: 'Steam', url: '#' }, {}],
  ['options.html', 'options.html', '/checkout/packages/add/13/single', { options: { package: { name: 'MVP', customPrice: true, price: '11.99' }, variables: [{ id: 1, description: 'Server', type: 'dropdown', options: [{ name: 'Survival', default: true, price: 0 }, { name: 'Skyblock', default: false, price: 1 }] }, { id: 2, description: 'Discord ID', type: 'discord_id', value: '', discord_tag: 'name#0000' }] } }, {}],
  ['checkout.html', 'checkout.html', '/checkout/basket', {}, { 'terms-url': '/terms' }],
  ['cms/page.html', 'page.html', '/faq', { id: 1, title: 'FAQ', metaData: { content: '<h3>How long is delivery?</h3><p>Under 2 minutes.</p>' } }, {}],
  ['cms/page.html', 'page-staff.html', '/staff', { id: 2, title: 'Staff team', metaData: { content: '' } }, { 'staff-list': 'Notch | Owner | Notch\njeb_ | Admin | jeb_\nDinnerbone | Moderator | Dinnerbone\nfoxy | Helper' }],
  ['cms/page.html', 'page-vote.html', '/vote', { id: 3, title: 'Vote', metaData: { content: '<p>Vote daily for a free key.</p>' } }, { 'vote-list': 'PlanetMinecraft | https://example.com/1\nMinecraft-MP | https://example.com/2\nTopG | https://example.com/3' }],
  ['cms/page.html', 'page-faq.html', '/faq', { id: 4, title: 'FAQ', metaData: { content: '' } }, { 'faq-list': 'How long is delivery? | Usually under 2 minutes. Stay online.\nCan I get a refund? | All digital sales are final.\nI play on Bedrock | Pick Bedrock on the login screen; we add the prefix.' }],
  ['cms/page.html', 'page-patrons.html', '/patrons', { id: 5, title: 'Patrons', metaData: { content: '' } }, { 'patrons-list': 'Luxen2017 | Diamond\nFratage | Gold\nwillo_mc | Gold\nNotch | Iron' }],
  ['index.html', 'home-extras.html', '/', { description: '<p>Sale, slider, pop-up, currency.</p>' }, { sale: 'Show', 'sale-end': '2030-01-01T00:00:00Z', slides: 'https://mc-heads.net/body/Notch/600 | Season 4 is live | /category/1\nhttps://www.youtube.com/watch?v=dQw4w9WgXcQ | Trailer\nhttps://mc-heads.net/body/jeb_/600 | New keys | /category/2', promo: 'On', 'promo-code': 'FROST10', 'promo-delay': '1', currencies: 'USD,EUR,GBP', 'logo-icon': 'crown-diamond', 'logo-animation': 'Bounce', 'logo-subtitle': 'Season 4 store' }],
  ['cms/page.html', 'page-setup.html', '/setup', { id: 6, title: 'Setup', metaData: { content: '' } }, { 'setup-page': 'On', 'server-ip': 'play.frostvale.net', 'faq-list': 'How long is delivery? | Under 2 minutes.', 'header-links': 'Rules|/rules, Vote|/vote' }],
  ['cms/page.html', 'page-setup-off.html', '/setup', { id: 6, title: 'Setup', metaData: { content: '<p>Plain page.</p>' } }, {}],
  ['cms/page.html', 'page-by-title.html', '/pages/7', { page: { id: 7, title: 'Staff', metaData: { content: '' } } }, { 'staff-list': 'Notch | Owner' }],
  ['username.html', 'login-error.html', '/login', { external: false, store: { ...store, userMessage: 'That username does not exist.' } }, {}],
  ['quote.html', 'quote.html', '/quote/abc', { content: '<p>Custom island build — 25.00 USD</p>' }, {}],
  ['cms/page.html', 'page-rules.html', '/rules', { id: 9, title: 'Rules', metaData: { content: '' } }, { 'rules-list': 'Chat | Be respectful to everyone.\nChat | No spam or advertising.\nGameplay | No hacked clients.\nGameplay | No duping or exploiting bugs.' }],
  ['cms/page.html', 'page-news.html', '/news', { id: 10, title: 'News', metaData: { content: '' } }, { 'news-list': 'Nov 20 | Season 4 is live | New map, new crates and a fresh economy. | https://mc-heads.net/body/Notch/400\nNov 02 | Halloween results | Thanks to everyone who joined the event.' }],
  ['category/tiered.html', 'category-tiered.html', '/category/9', { category: { id: 9, name: 'Monthly ranks', description: '<p>Upgrade any time.</p>' }, content: '<p>[Tebex tier selector]</p>' }, {}],
  ['email/abandonedcart.html', 'email-abandonedcart.html', '/', {}, {}],
  ['email/purchasefollowup.html', 'email-purchasefollowup.html', '/', {}, {}],
  ['email/downloadablepackage.html', 'email-downloadablepackage.html', '/', { content: '<p>Download: <a href="#">world.zip</a></p>' }, {}],
  // Preset / format variants of the homepage
  ['index.html', 'v-ocean-tabs.html', '/', { description: '<p>Ocean preset.</p>' }, { preset: 'Ocean', 'category-style': 'Tabs', 'header-style': 'Compact', corners: 'Soft', 'heading-font': 'Tech', announcement: 'Show', 'announcement-end': '2030-01-01T00:00:00Z' }],
  ['index.html', 'v-cherry-sidebar.html', '/', { description: '<p>Cherry preset.</p>' }, { preset: 'Cherry', 'category-style': 'Sidebar', corners: 'Round', 'panel-style': 'Flat', 'heading-font': 'Clean' }],
  ['index.html', 'v-deepdark-minimal.html', '/', { description: '<p>Deep Dark.</p>' }, { preset: 'Deep Dark', 'header-style': 'Minimal', 'panel-style': 'Outline', 'category-style': 'None' }],
  ['index.html', 'v-desert.html', '/', { description: '<p>Desert.</p>' }, { preset: 'Desert', 'heading-font': 'Blocky' }],
  ['index.html', 'v-light.html', '/', { description: '<p>Light mode.</p>' }, { preset: 'Overworld', 'color-mode': 'Light' }],
  ['index.html', 'v-custom.html', '/', { description: '<p>Custom colors.</p>' }, { preset: 'Custom', 'color-accent': '#FF4D6D', 'color-secondary': '#00D1FF', 'color-background': '#101014' }]
];

let failed = 0;
const modulesHtml = (() => { cfg = {}; return renderModules(); })();
for (const [file, out, p, data, conf] of pages) {
  cfg = conf; curPath = p;
  try {
    const html = render(file, { store, basket, page, modules: modulesHtml, ...data });
    fs.writeFileSync(path.join(outDir, out), html);
    console.log('ok   ', out, html.length);
  } catch (e) {
    failed++;
    console.log('FAIL ', out, '-', e.message || e);
  }
}
const links = pages.map(p => `<li><a href="${p[1]}">${p[1]}</a></li>`).join('');
fs.writeFileSync(path.join(outDir, 'index-of-pages.html'), `<!doctype html><meta charset=utf-8><title>OZ test pages</title><ul>${links}</ul>`);
// Workbench: page list + device / preset switchers around an iframe (open /workbench.html).
const wbPages = pages.map(([template, file, p]) => ({ template, file, path: p }));
const wb = fs.readFileSync(path.join(__dirname, 'workbench.html'), 'utf8').replace('/*PAGES*/[]', JSON.stringify(wbPages));
fs.writeFileSync(path.join(outDir, 'workbench.html'), wb);

// Icon gallery: every icon by group, click to copy its name.
const iconGroups = JSON.parse(fs.readFileSync(path.join(__dirname, 'icons.json'), 'utf8'));
const iconTotal = Object.values(iconGroups).reduce((n, g) => n + g.length, 0);
const gallery = Object.entries(iconGroups).map(([g, names]) =>
  `<h2>${g} <small>${names.length}</small></h2><div class="grid">${names.map(n => `<button type="button" data-n="${n}" title="${n}"><span class="oz-ico oz-ico--${n}"></span><code>${n}</code></button>`).join('')}</div>`).join('');
fs.writeFileSync(path.join(outDir, 'icons.html'), `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>OZ icons</title>
<link rel=stylesheet href="oz.css"><link rel=stylesheet href="oz-icons.css">
<style>body{padding:20px 24px;margin:0}h1,h2{font-family:var(--font-pixel)}h2 small{color:var(--muted);font-size:13px}input{max-width:320px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px}
.grid button{display:grid;justify-items:center;gap:6px;padding:12px 6px;background:var(--slot);border:3px solid var(--line);color:var(--soft);cursor:pointer}
.grid button:hover{background:var(--raise)}.grid button[hidden]{display:none}.grid .oz-ico{width:48px;height:48px}.grid code{font-size:11px;word-break:break-all}</style>
<h1>OZ icons <small>${iconTotal}</small></h1><p class=oz-muted>Click an icon to copy its name. Use it in the <code>category-icons</code> or <code>package-icons</code> setting, e.g. <code>Ranks=crown-gold</code>.</p>
<input class=oz-input id=q placeholder="Search icons…" autocomplete=off>
<div id=all>${gallery}</div><div class="oz-panel oz-pop" data-oz-pop></div>
<script>q.oninput=()=>document.querySelectorAll('.grid button').forEach(b=>b.hidden=!b.dataset.n.includes(q.value.trim()));
document.addEventListener('click',e=>{const b=e.target.closest('[data-n]');if(!b)return;navigator.clipboard&&navigator.clipboard.writeText(b.dataset.n);const p=document.querySelector('[data-oz-pop]');p.textContent='Copied '+b.dataset.n;p.classList.add('is-on');setTimeout(()=>p.classList.remove('is-on'),1200)});</script>`);
process.exit(failed ? 1 : 0);
