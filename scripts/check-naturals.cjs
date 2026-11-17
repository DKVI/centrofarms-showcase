const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname,'..');
const data = JSON.parse(fs.readFileSync(path.join(root,'naturals/source/content.json'),'utf8'));
const entries = ['naturals/index.html','vi/naturals/index.html','naturals/catalogue/index.html',...data.pages.map(p=>'naturals/'+p.slug+'/index.html')];
const normalize = s=>s.replace(/\s+/g,' ').trim();
const plain = s=>normalize(s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"));
for(const file of entries) {
 const html=fs.readFileSync(path.join(root,file),'utf8');
 const base=new URL(html.match(/<base href="([^"]+)"/)[1], 'https://local.test/'+file);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,'Duplicate IDs: '+file);
 for(const m of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const url=new URL(m[1].replace(/&amp;/g,'&'),base);
  if(url.hostname!=='local.test')continue;
  if(m[1].startsWith('#')) { assert(ids.includes(url.hash.slice(1)),'Missing anchor '+m[1]); continue; }
  let target=path.join(root,decodeURIComponent(url.pathname));
  if(url.pathname.endsWith('/'))target=path.join(target,'index.html');
  assert(fs.existsSync(target),'Missing destination '+file+' -> '+m[1]);
 }
 assert(!/href="https:\/\/centrofarms\.com\/(?:en|vi)\/"[^>]*>CentroFarms™ Naturals/.test(html),'External Naturals link');
}
const homepage = plain(fs.readFileSync(path.join(root,'naturals/index.html'),'utf8'));
for(const part of [...data.slides,...data.features,...data.testimonials,...data.featuredProducts.slice(3,6),...data.posts,data.philosophy,data.partner]) {
 for(const key of ['title','description','quote','name','job'])if(part[key])assert(homepage.includes(normalize(part[key])),'Source wording missing: '+part[key]);
}
const html = fs.readFileSync(path.join(root,'naturals/index.html'),'utf8');
assert.equal((html.match(/data-nt-panel/g)||[]).length,3);
assert(html.includes('assets/naturals.js'),'Carousel script missing');
assert(html.includes('img/naturals/hero-salt-rocks.png'),'Original banner artwork missing');
assert(html.includes('img/naturals/hero-wellness.png'),'Third banner artwork missing');
assert.equal((html.match(/<h2>Popular Products<\/h2>/g)||[]).length,1,'Duplicate Popular Products section');
assert(!html.includes('Our Bestsellers'),'Old Bestsellers section remains');
assert.equal(data.products.length,9,'Incomplete catalogue');
const catalogue=fs.readFileSync(path.join(root,'naturals/catalogue/index.html'),'utf8');
assert.equal((catalogue.match(/class="nt-bestseller-card"/g)||[]).length,9,'Incorrect catalogue card count');
for(const product of data.products)assert(plain(catalogue).includes(normalize(product.title)),'Catalogue product missing: '+product.title);
console.log(`PASS: ${entries.length} pages; all nine catalogue products and links; source copy; one Popular Products section; three banners.`);
