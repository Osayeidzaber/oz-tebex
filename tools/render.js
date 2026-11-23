// Renders every OZ template with mock Tebex data using twig.js.
// Usage: node tools/render.js <themeDir> <outDir>
const fs = require('fs');
const path = require('path');
const Twig = require('twig');

const themeDir = path.resolve(process.argv[2]);
const outDir = path.resolve(process.argv[3]);
const tpl = path.join(themeDir, 'templates');
fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(path.join(themeDir, 'assets/oz.css'), path.join(outDir, 'oz.css'));
fs.copyFileSync(path.join(themeDir, 'assets/oz.js'), path.join(outDir, 'oz.js'));

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
  const t = Twig.twig({ path: path.join(tpl, file), async: false, rethrow: true, base: tpl });
  return t.render(ctx);
}

const pages = [
  ['index.html', 'index.html', '/', { description: '<p>Ranks, keys and cosmetics for every gamemode.</p>' }, {}],
  ['category.html', 'category-grid.html', '/category/2', { id: 2, name: 'Keys', displayType: 'grid', description: '<p>Open crates at /warp crates.</p>', packages: keys, slug: 'keys' }, { 'quantity-categories': 'Keys' }],
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
process.exit(failed ? 1 : 0);
