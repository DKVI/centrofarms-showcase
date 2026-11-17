// Rebuild the Naturals presentation from the owner's source snapshot.
// Copy is extracted verbatim; only whitespace and layout markup change.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'naturals/source/home.html'), 'utf8');
const decode = s => s.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : +n)).replace(/&(amp|lt|gt|quot|apos|nbsp|rsquo|lsquo|rdquo|ldquo|ndash|mdash|hellip);/g, (_, n) => ({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'",nbsp:' ',rsquo:'’',lsquo:'‘',rdquo:'”',ldquo:'“',ndash:'–',mdash:'—',hellip:'…'}[n]));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function parse(html) {
  const tree = {tag:'root', attrs:{}, children:[]}; const stack = [tree];
  const tokens = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').match(/<!--[\s\S]*?-->|<[^>]*>|[^<]+/g) || [];
  for (const token of tokens) {
    if (token.startsWith('<!--') || token.startsWith('<!')) continue;
    if (token.startsWith('</')) {
      const tag = token.match(/^<\/([^\s>]+)/)?.[1].toLowerCase();
      for(let i=stack.length-1;i>0;i--) if(stack[i].tag === tag) { stack.length=i; break; }
    } else if (token.startsWith('<')) {
      const tag = token.match(/^<([^\s/>]+)/)?.[1].toLowerCase(); if (!tag) continue;
      const attrs = {}; for (const m of token.matchAll(/([^\s=<>/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) attrs[m[1]] = decode(m[2] ?? m[3]);
      const node = {tag,attrs,children:[]}; stack.at(-1).children.push(node);
      if (!/^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/.test(tag) && !token.endsWith('/>')) stack.push(node);
    } else stack.at(-1).children.push(token);
  }
  return tree;
}
function all(node, test) { const result=[]; for(const child of node.children||[]) if(typeof child !== 'string') { if(test(child)) result.push(child); result.push(...all(child,test)); } return result; }
const cls = (n,c) => (n.attrs.class||'').split(/\s+/).includes(c);
const byClass = (n,c) => all(n, x=>cls(x,c));
const text = n => decode(typeof n === 'string' ? n : n?.tag === 'br' ? ' ' : (n?.children||[]).map(text).join(' ')).replace(/\s+/g,' ').trim();
const first = (n,c) => byClass(n,c)[0];
const tree = parse(source);
const assets = [];
function image(url, label) {
  if (!url) throw Error('Missing image: '+label);
  if(url.startsWith('//')) url = 'https:'+url;
  const ext = path.extname(new URL(url).pathname) || '.jpg';
  const local = 'img/naturals/' + label + ext;
  if(!assets.some(a=>a.path===local)) assets.push({url,path:local});
  return local;
}
const imgNode = n => all(n,x=>x.tag==='img')[0];
const img = (n,label) => image(imgNode(n)?.attrs.src,label);
const slides = all(tree,n=>n.tag==='sr7-slide').map((n,i)=>{
  const lines = all(n,x=>x.tag==='sr7-txt').map(text); if(!lines.length) return null;
  return {title:lines[0],eyebrow:lines[1],cta:lines[2],description:lines[3],image:img(n,'hero-'+i)};
}).filter(Boolean);
const featuredProducts = byClass(tree,'product').filter(n=>n.tag==='li').map((n,i)=>{
  const title = first(n,'woocommerce-loop-product__title'); const a = all(title||{},x=>x.tag==='a')[0];
  return {title:text(title),url:a?.attrs.href,image:img(n,'product-'+i)};
}).filter(p=>p.title && p.url);
const shopSource=fs.readFileSync(path.join(root,'naturals/source/shop.html'),'utf8');
const shopTree=parse(shopSource);
const products=byClass(shopTree,'product').filter(n=>n.tag==='li').map(n=>{
 const title=first(n,'woocommerce-loop-product__title');
 const url=all(title||{},x=>x.tag==='a')[0]?.attrs.href;
 if(!title||!url)return null;
 const existing=featuredProducts.find(p=>p.url===url);
 const slug=new URL(url).pathname.split('/').filter(Boolean).at(-1);
 return {title:text(title),url,image:existing?.image||img(n,'catalogue-'+slug)};
}).filter(Boolean);
if(products.length!==9||new Set(products.map(p=>p.url)).size!==9)throw Error('Expected nine unique source catalogue products');
for(const p of featuredProducts)if(!products.some(item=>item.url===p.url))throw Error('Featured product missing from catalogue: '+p.title);
const heroArtwork = image('https://centrofarms.com/wp-content/uploads/2026/08/Artboard-2-8.png','hero-salt-rocks');
const wellnessArtwork = image('https://centrofarms.com/wp-content/uploads/2026/08/Artboard-2-copy-5@2x-8.png','hero-wellness');
const posts = byClass(tree,'post-inner').map((n,i)=>({
  title:text(first(n,'entry-title')),description:text(first(n,'entry-excerpt')),url:all(first(n,'entry-title')||{},x=>x.tag==='a')[0]?.attrs.href,
  date:text(first(n,'posted-on')),author:text(first(n,'post-author')),image:img(n,'story-'+i)
}));
const testimonials = byClass(tree,'elementor-testimonial-item').map(n=>({title:text(first(n,'testimonial-title')),quote:text(first(n,'content')),name:text(first(n,'name')),job:text(first(n,'job'))}));
const features = byClass(tree,'elementor-icon-box-wrapper').map(n=>({title:text(first(n,'elementor-icon-box-title')),description:text(first(n,'elementor-icon-box-description'))})).filter(n=>n.description);
const journey = byClass(tree,'elementor-image-box-wrapper').map((n,i)=>({title:text(first(n,'elementor-image-box-title')),image:img(n,'journey-'+i)})).filter(n=>n.title);
const philosophyImage = all(tree,n=>n.tag==='img' && (n.attrs.src||'').includes('D14x1-ezgif'))[0];
const philosophyAsset = image((philosophyImage.attrs.srcset||'').split(',').map(s=>s.trim().split(' ')[0]).find(s=>s.includes('724x1024')) || philosophyImage.attrs.src,'philosophy');
const headings = all(tree,n=>/^h[12]$/.test(n.tag)).map(text);
const findHeading = s => { const h=headings.find(h=>h.startsWith(s)); if(!h)throw Error('Heading missing '+s); return h; };
const sourceTexts = all(tree,n=>['p','sr7-txt'].includes(n.tag)).map(text);
const findText = s => {const p=sourceTexts.find(p=>p.startsWith(s));if(!p)throw Error('Text missing '+s);return p;};
const content = {source:'https://centrofarms.com/en/',catalogueSource:'https://centrofarms.com/en/shop/',catalogueResultCount:text(first(shopTree,'woocommerce-result-count')),slides,products,featuredProducts,posts,testimonials,features,journey,
  philosophy:{title:findHeading('Rooted in Purity'),description:findText('True wellness'),image:philosophyAsset},
  partner:{title:findHeading('Unlock Wholesale'),description:findText('*Register')},
  pages:[...products.map(p=>({title:p.title,url:p.url,type:'product'})),...posts.map(p=>({title:p.title,url:p.url,type:'story'}))]
};
for(const page of content.pages) page.slug = new URL(page.url).pathname.split('/').filter(Boolean).at(-1);
const picture = (src,alt='',extra='')=>`<img src="${esc(src)}" alt="${esc(alt)}" ${extra}>`;
const arrow='<span aria-hidden="true">↗</span>';
function localPage(url){const p=content.pages.find(p=>p.url===url);return 'naturals/'+p.slug+'/';}
const bestsellerCards = items=>items.map(p=>{
 const weight=p.title.match(/\s+(?:19 lb(?: \(8\.62 kg\))?|368\.5 g \(13 oz\)|2\.27 kg \(5 lb\))$/);
 const title=weight?p.title.slice(0,-weight[0].length):p.title;
 return `<a class="nt-bestseller-card" href="${localPage(p.url)}"><div class="nt-bestseller-photo">${picture(p.image,p.title,'loading="lazy"')}</div><div class="nt-bestseller-copy"><h3>${esc(title)}</h3><div class="nt-bestseller-meta"><span>${esc(weight?.[0].trim()||'')}</span>${arrow}</div></div></a>`;
}).join('\n');
const main=`<main id="naturals-main" class="nt-page" lang="en">
<div class="shell intro-header nt-naturals-intro"><nav class="bread" aria-label="Breadcrumb"><a href="./">CentroFarms™</a><span aria-hidden="true">›</span><b aria-current="page">Naturals</b></nav><div class="intro-tag">Himalayan Pink Salt Supplier &amp; Distributor</div></div>
<section class="nt-source-hero" data-nt-carousel aria-label="CentroFarms Naturals" aria-roledescription="carousel">
<article class="nt-hero-panel is-active" data-nt-panel aria-label="1 / 3" aria-hidden="false">
<div class="nt-source-watermark" aria-hidden="true">CENTROFARMS CENTROFARMS CENTROFARMS</div>
<div class="shell nt-source-hero-inner"><div class="nt-source-hero-copy"><span class="nt-eyebrow">${esc(slides[0].eyebrow)}</span><h1><span>Premium Wholesale</span><span>Qualified Supply</span></h1><p>${esc(slides[0].description)}</p><a class="nt-source-hero-button" href="#philosophy">OUR CORE PHILOSOPHY <span aria-hidden="true">→</span></a></div></div>
${picture(heroArtwork,'Himalayan pink salt crystals on a wooden display','class="nt-source-hero-art" fetchpriority="high"')}
</article>
<article class="nt-hero-panel nt-hero-seabeds" data-nt-panel aria-label="2 / 3" aria-hidden="true" inert>
${picture(slides[1].image,'Himalayan pink salt with natural home accessories','class="nt-seabeds-photo" loading="eager"')}
<div class="shell nt-source-hero-inner"><div class="nt-source-hero-copy"><span class="nt-eyebrow">${esc(slides[1].eyebrow)}</span><h2 class="nt-hero-heading"><span>Sourced From</span><span>Ancient Seabeds</span></h2><p>${esc(slides[1].description)}</p><a class="nt-source-hero-button" href="#philosophy">OUR CORE PHILOSOPHY <span aria-hidden="true">→</span></a></div></div>
</article>
<article class="nt-hero-panel nt-hero-wellness" data-nt-panel aria-label="3 / 3" aria-hidden="true" inert>
<div class="shell nt-source-hero-inner"><div class="nt-source-hero-copy"><span class="nt-eyebrow">${esc(slides[2].eyebrow)}</span><h2 class="nt-hero-heading"><span>Flavor,</span><span>Naturally Refined</span></h2><p>${esc(slides[2].description)}</p><a class="nt-source-hero-button" href="#naturals-stories">${esc(slides[2].cta)} <span aria-hidden="true">→</span></a></div></div>
${picture(wellnessArtwork,'Hands holding a bowl of Himalayan pink salt','class="nt-wellness-art" loading="eager"')}
</article>
<div class="nt-carousel-controls"><button type="button" data-nt-select="0" aria-label="Premium Wholesale Qualified Supply" aria-pressed="true"></button><button type="button" data-nt-select="1" aria-label="Sourced From Ancient Seabeds" aria-pressed="false"></button><button type="button" data-nt-select="2" aria-label="${esc(slides[2].title)}" aria-pressed="false"></button></div>
</section>
<section class="shell nt-philosophy nt-section" id="philosophy"><div class="nt-philosophy-photo">${picture(philosophyAsset,'','loading="lazy"')}</div><div><span class="nt-eyebrow">OUR CORE PHILOSOPHY</span><h2>Rooted in Purity<br><em>Built for Daily Habits</em></h2><p class="nt-intro">${esc(content.philosophy.description)}</p><div class="nt-features">${features.map((f,i)=>`<div><span class="nt-index">0${i+1}</span><h3>${esc(f.title)}</h3><p>${esc(f.description)}</p></div>`).join('')}</div><a class="nt-text-link" href="#collections">EXPLORE OUR COLLECTIONS ${arrow}</a></div></section>
<section class="nt-collection-wrap" id="collections"><div class="shell nt-section"><div class="nt-section-heading"><h2>Popular Products</h2><a class="nt-bestseller-all" href="naturals/catalogue/">See all ${arrow}</a></div><div class="nt-product-grid">${bestsellerCards(featuredProducts.slice(3,6))}</div></div></section>
<section class="shell nt-section"><div class="nt-section-heading"><div><span class="nt-eyebrow">testimonials</span><h2>Trusted by Partners Worldwide</h2></div></div><div class="nt-quotes">${testimonials.map(t=>`<figure class="nt-quote"><span class="nt-quote-mark" aria-hidden="true">“</span><h3>${esc(t.title)}</h3><blockquote>${esc(t.quote)}</blockquote><figcaption><strong>${esc(t.name)}</strong><span>${esc(t.job)}</span></figcaption></figure>`).join('')}</div></section>
<section class="nt-journey-wrap"><div class="shell nt-section"><div class="nt-journey-heading"><span class="nt-eyebrow">why us</span><h2>The Journey of Purity</h2></div><div class="nt-journey-track"><svg class="nt-journey-connector" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 56 125 36 375 64 625 36 875 64 998 44 M990 43 998 44 993 47" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke" /></svg><ol class="nt-journey">${journey.map((j,i)=>`<li class="nt-journey-step"><div class="nt-journey-picture">${picture(j.image,'','loading="lazy"')}<span class="nt-journey-marker">0${i+1}</span></div><h3>${esc(j.title)}</h3></li>`).join('')}</ol></div></div></section>
<section class="shell nt-section" id="naturals-stories"><span class="nt-eyebrow">why us</span><h2>The Story of Pink Salt</h2><div class="nt-stories">${posts.map(p=>`<article><a class="nt-story-photo" href="${localPage(p.url)}">${picture(p.image,'','loading="lazy"')}</a><div class="nt-story-meta"><span>The Story of Pink Salt</span><span>${esc(p.date)}</span></div><h3><a href="${localPage(p.url)}">${esc(p.title)}</a></h3><p>${esc(p.description)}</p><a class="nt-text-link" href="${localPage(p.url)}">Read more ${arrow}</a></article>`).join('')}</div></section>
<section class="shell nt-partner"><div><span class="nt-eyebrow">PARTNER WITH CENTROFARMS</span><h2>${esc(content.partner.title)}</h2><p>${esc(content.partner.description)}</p></div><a class="nt-button" href="contact/">BECOME A PARTNER ${arrow}</a></section>
</main>`;
function shell(prefix,body,title,description='') {
 const home=fs.readFileSync(path.join(root,prefix?'vi/index.html':'index.html'),'utf8');
 let header=home.match(/<header\b[\s\S]*?<\/header>/)[0];
 let footer=home.match(/<footer\b[\s\S]*?<\/footer>/)[0];
 header=header.replace(/href="vi\/" lang="vi"/,'href="vi/naturals/" lang="vi"').replace(/href="\.\/" lang="en"/,'href="naturals/" lang="en"');
 if(prefix) header=header.replace(/href="[^"]*" lang="en"/,'href="naturals/" lang="en"');
 header=header.replace(/(<a class="nav-link[^\"]*"[^>]*)(>CentroFarms™ Naturals)/,'$1 aria-current="page"$2');
 return `<!doctype html><html lang="${prefix?'vi':'en'}"><head><meta charset="utf-8"><base href="${prefix?'../../':'../'}"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#102d25"><title>${esc(title)} | CentroFarms™</title><meta name="description" content="${esc(description)}"><link rel="stylesheet" href="assets/${prefix?'site-vi':'site'}.css"><link rel="stylesheet" href="assets/naturals.css"><link rel="icon" href="img/a9431ba808bd0123e16594bc6e1e6c3dc072743b.webp"></head><body data-language="${prefix?'vi':'en'}" data-page="naturals">${header}${body}${footer}<script src="assets/site.js"></script><script src="assets/naturals.js"></script></body></html>`;
}
fs.mkdirSync(path.join(root,'vi/naturals'),{recursive:true});
for(const prefix of ['', 'vi/']) fs.writeFileSync(path.join(root,prefix,'naturals/index.html'),shell(prefix,main,'Naturals','Himalayan Pink Salt Supplier & Distributor'));
const catalogue=`<main class="nt-page nt-catalogue" lang="en"><section class="shell nt-section"><div class="nt-section-heading"><div><h1>Catalogue</h1><p>${esc(content.catalogueResultCount)}</p></div><a class="nt-bestseller-all" href="naturals/">CentroFarms™ Naturals ${arrow}</a></div><div class="nt-product-grid">${bestsellerCards(products)}</div></section></main>`;
fs.mkdirSync(path.join(root,'naturals/catalogue'),{recursive:true});
fs.writeFileSync(path.join(root,'naturals/catalogue/index.html'),shell('',catalogue,'Catalogue').replace('<base href="../">','<base href="../../">'));
fs.writeFileSync(path.join(root,'naturals/source/content.json'),JSON.stringify(content,null,2)+'\n');
fs.writeFileSync(path.join(root,'naturals/source/assets.json'),JSON.stringify(assets,null,2)+'\n');
console.log(`Extracted ${slides.length} slides, ${products.length} products, ${features.length} features, ${testimonials.length} testimonials, ${journey.length} process images, ${posts.length} stories. ${assets.length} source images.`);
module.exports = {parse,all,cls,byClass,text,first,esc,decode,shell,content,root};
