const fs = require('fs');
const path = require('path');
const {parse,all,cls,byClass,text,first,esc,shell,content,root} = require('./build-naturals.cjs');
const permitted = new Set('p h2 h3 h4 h5 h6 strong b em i u ul ol li table thead tbody tfoot tr th td caption br blockquote a'.split(' '));
const localURLs = new Map(content.pages.map(p=>[p.url,'naturals/'+p.slug+'/']));
function render(node) {
 if(typeof node==='string')return esc(node);
 if(['script','style','form','button','input','iframe','svg','img'].includes(node.tag))return '';
 if(cls(node,'jp-relatedposts') || cls(node,'sharedaddy') || cls(node,'sd-sharing-enabled') || node.attrs?.id==='ez-toc-container')return '';
 const inside=(node.children||[]).map(render).join('');
 if(!permitted.has(node.tag))return inside;
 if(node.tag==='br')return '<br>';
 let attrs='';
 if(node.tag==='a' && node.attrs.href) {
  let href=node.attrs.href;
  if(href.startsWith('/'))href='https://centrofarms.com'+href;
  href=localURLs.get(href)||href;
  if(!/^(?:https?:|mailto:|tel:|#|naturals\/)/i.test(href))return inside;
  attrs=' href="'+esc(href)+'"';
 }
 if(['td','th'].includes(node.tag))for(const attr of ['colspan','rowspan'])if(/^\d+$/.test(node.attrs[attr]||''))attrs+=' '+attr+'="'+node.attrs[attr]+'"';
 return '<'+node.tag+attrs+'>'+inside+'</'+node.tag+'>';
}
const records=[];
function productBody(page,p,tree,selected) {
 const description=selected.find(n=>n.attrs.id==='tab-description');
 const information=selected.find(n=>n.attrs.id==='tab-additional_information');
 const intro=all(description||{},n=>n.tag==='p')[0];
 const category=first(tree,'posted_in');
 const weight=page.title.match(/\s+(?:19 lb(?: \(8\.62 kg\))?|368\.5 g \(13 oz\)|2\.27 kg \(5 lb\))$/)?.[0].trim();
 const attributes=all(information||{},n=>n.tag==='tr').map(row=>({label:text(all(row,n=>n.tag==='th')[0]),value:text(all(row,n=>n.tag==='td')[0])})).filter(a=>a.label&&a.value);
 const sections=selected.map((n,i)=>({label:text(all(n,x=>x.tag==='h2')[0])||'Description',id:n.attrs.id,copy:render(n),index:i}));
 return `<main class="nt-page nt-product-page" lang="en"><article class="shell nt-pdp">
<nav class="nt-pdp-breadcrumb" aria-label="Breadcrumb"><a href="./">CentroFarms™</a><span aria-hidden="true">›</span><a href="naturals/">Naturals</a><span aria-hidden="true">›</span><a href="naturals/catalogue/">Catalogue</a><span aria-hidden="true">›</span><span aria-current="page">${esc(page.title)}</span></nav>
<div class="nt-pdp-layout"><div class="nt-pdp-gallery"><button class="nt-pdp-photo" type="button" data-product-zoom aria-label="Zoom product image" aria-haspopup="dialog" aria-controls="productZoom"><img src="${esc(p.image)}" alt="${esc(page.title)}" fetchpriority="high"><span class="nt-pdp-zoom-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6m-3-3v6"/></svg></span></button></div>
<div class="nt-pdp-summary">${category?`<a class="nt-pdp-category" href="naturals/catalogue/">${esc(text(category))}</a>`:''}<h1>${esc(page.title)}</h1>${weight?`<div class="nt-pdp-weight">${esc(weight)}</div>`:''}<div class="nt-source-copy nt-pdp-intro">${intro?render(intro):''}</div>${attributes.length?`<dl class="nt-pdp-attributes">${attributes.map(a=>`<div><dt>${esc(a.label)}</dt><dd>${esc(a.value)}</dd></div>`).join('')}</dl>`:''}<div class="nt-pdp-actions"><a class="nt-pdp-contact" href="contact/">Contact <span aria-hidden="true">↗</span></a><a class="nt-pdp-catalogue" href="naturals/catalogue/">Catalogue <span aria-hidden="true">↗</span></a></div></div></div>
<section class="nt-pdp-details" data-product-details><div class="nt-pdp-tabs" role="tablist" aria-label="Product Details">${sections.map(s=>`<button type="button" role="tab" id="${s.id}-tab" aria-controls="${s.id}" aria-selected="${s.index===0}" tabindex="${s.index===0?'0':'-1'}">${esc(s.label)}</button>`).join('')}</div>${sections.map(s=>`<div class="nt-pdp-panel nt-source-copy" id="${s.id}" role="tabpanel" aria-labelledby="${s.id}-tab" tabindex="0" ${s.index?'hidden':''}>${s.copy}</div>`).join('')}</section>
</article><dialog class="editorial-modal nt-product-zoom" id="productZoom" aria-label="${esc(page.title)}"><div class="nt-product-zoom-inner"><button type="button" class="modal-close" aria-label="Close image">×</button><img src="${esc(p.image)}" alt="${esc(page.title)}" loading="lazy"></div></dialog></main>`;
}
for(const page of content.pages) {
 const raw=fs.readFileSync(path.join(root,'naturals/source',page.slug+'.html'),'utf8');
 const tree=parse(raw); let selected=[];
 if(page.type==='product') {
  for(const id of ['tab-description','tab-additional_information']) {const n=all(tree,n=>n.attrs.id===id)[0];if(n) selected.push(n);}
 } else {
  const article=all(tree,n=>n.tag==='article' && cls(n,'type-post'))[0];
  const n=article && first(article,'entry-content');if(n)selected.push(n);
 }
 if(!selected.length)throw Error('No content: '+page.slug);
 const copy=selected.map(render).join('\n');
 const p=content.products.find(p=>p.url===page.url)||content.posts.find(p=>p.url===page.url);
 const body=page.type==='product'?productBody(page,p,tree,selected):`<main class="nt-page" lang="en"><article class="shell nt-detail nt-article"><div class="nt-breadcrumb"><a href="naturals/">CentroFarms™ Naturals</a> / ${esc(page.title)}</div><img src="${esc(p.image)}" alt="${esc(page.title)}"><div><h1>${esc(page.title)}</h1><div class="nt-source-copy">${copy}</div></div></article></main>`;
 const output=path.join(root,'naturals',page.slug);fs.mkdirSync(output,{recursive:true});
 let html=shell('',body,page.title).replace('<base href="../">','<base href="../../">');
 // Detail content is English; language links return to the corresponding Naturals overview.
 html=html.replace('href="vi/" lang="vi"','href="vi/naturals/" lang="vi"');
 if(page.type==='product')html=html.replace('</body>','<script src="assets/naturals-product.js"></script></body>');
 for(const section of selected)if(!html.includes(render(section)))throw Error('Source content changed: '+page.slug);
 fs.writeFileSync(path.join(output,'index.html'),html);
 records.push({url:page.url,path:'naturals/'+page.slug+'/index.html',sourceText:selected.map(text)});
}
fs.writeFileSync(path.join(root,'naturals/source/details.json'),JSON.stringify(records,null,2)+'\n');
console.log('Built '+records.length+' internal product and story pages from source.');
