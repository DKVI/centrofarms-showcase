const fs = require('node:fs');
const path = require('node:path');
const icons = {
 larvae: '<path d="M6 17c-3-3-2-7 1-9 2-2 4-1 5 1s3 1 4 0 4-1 5 2-1 6-4 6H6Z"/><path d="m7 9 1 7m4-6 1 7m4-7 1 6"/>',
 protein: '<circle cx="6" cy="7" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m9 7 6-1M7 10l4 5m6-6-4 6"/>',
 oil: '<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
 poultry: '<path d="M5 11c-3-4-3-6-2-7l5 4c3-5 8-4 9 0l4 2-4 2v3c0 4-4 5-7 4s-5-4-5-8Z"/><path d="m9 19-1 3m6-3 1 3M14 3l1 2"/><circle cx="14" cy="8" r=".7" fill="currentColor"/>',
 fish: '<path d="M3 12c4-7 11-7 15-2l4-4v12l-4-4c-4 5-11 5-15-2Z"/><circle cx="7" cy="11" r="1" fill="currentColor"/><path d="m11 6 3-3 2 4m-5 11 3 3 2-4"/>',
 leaf: '<path d="M20 3C9 2 3 7 4 14c1 8 16 9 16-11Z"/><path d="M3 22 16 8m-8 9v-5m4 1h5"/>',
 growth: '<path d="M4 20h16M7 16V9m5 7V5m5 11v-4M4 7l7-5 8 4"/>',
 grain: '<path d="M12 22V3m0 7C5 10 4 6 4 4c5 0 8 2 8 6Zm0 5c7 0 8-4 8-6-5 0-8 2-8 6Zm0 5c-7 0-8-4-8-6 5 0 8 2 8 6Z"/>',
 heat: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 14h8m-8 3h8M8 7c-3-3 3-3 0-6m5 6c-3-3 3-3 0-6m5 6c-3-3 3-3 0-6"/>',
 cycle: '<path d="M20 8a9 9 0 0 0-15-3L2 8m0-5v5h5m-3 8a9 9 0 0 0 15 3l3-3m-5 0h5v5"/>'
};
const icon = name => `<svg class="bug-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
function titleCaseHeadings(html) {
 const brandNames = /^(CentroFarms|EnviroFlight|EnviroBug|EnviroPro|EnviroMeal|EnviroOil|EnviroFeed)$/i;
 const title = text => text.replace(/[\p{L}\p{M}]+/gu, word => {
  if (brandNames.test(word)) return ['CentroFarms','EnviroFlight','EnviroBug','EnviroPro','EnviroMeal','EnviroOil','EnviroFeed'].find(name => name.toLowerCase() === word.toLowerCase());
  return word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase();
 });
 return html.replace(/<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>|<(span|div)\b([^>]*class="(?:ax-label|section-overline|intro-tag)"[^>]*)>([\s\S]*?)<\/\4>/g, (match, heading, attrs, body, tag, labelAttrs, labelBody) => {
  const content = body ?? labelBody;
  const updated = content.split(/(<[^>]*>)/g).map(part => part.startsWith('<') ? part : title(part).replace(/\./g, '')).join('');
  return `<${heading || tag}${attrs ?? labelAttrs}>${updated}</${heading || tag}>`;
 });
}
const marketImages = ['poultry.jpg','aquaculture.jpg','wildlife.png','piglets.jpg'];
const marketIcons = ['poultry','fish','leaf','growth'];
const processIcons = ['grain','larvae','heat','cycle'];
const sources = [
 ['EnviroFlight · Products', 'https://www.darlingii.com/enviroflight/products'],
 ['EnviroFlight · Markets', 'https://www.darlingii.com/enviroflight/markets'],
 ['EnviroFlight · Insects as Nutrition and Enrichment (PDF)', 'https://www.feedinfo.com/media/ny1ppa4y/insects-as-nutrition-and-enrichment-3.pdf'],
 ['EnviroFlight · Pet Nutrition (PDF)', 'https://www.feedinfo.com/media/v41l00lm/pet-nutrition-white-paper-final.pdf']
];
const copy = {
 en: {
  tag: 'ANIMAL NUTRITION · WHOLE DRIED LARVAE', intro: 'Small larvae. Valuable nutrition.',
  lead: 'EnviroBug is EnviroFlight’s whole, oven-dried black soldier fly larvae (Hermetia illucens): a protein-rich ingredient supplying both amino acids and fatty acids.',
  sub: 'Discover an insect ingredient for your feeding program, with product information and application support from CentroFarms™.',
  explore: 'Explore EnviroBug', contact: 'Request product information', details: 'PRODUCT OVERVIEW', title: 'Whole larvae.<br>One ingredient.',
  overview: 'EnviroBug keeps the larvae in their whole dried form. Unlike the pressed meal and separated oil, it brings the protein and lipid fractions together.',
  overview2: 'EnviroFlight describes oven drying without chemicals or microwaves. Ask for the current technical sheet and batch analysis when evaluating a formulation.',
  traits: [['Whole', 'DRIED LARVAE'], ['Protein', 'AMINO ACIDS'], ['Lipids', 'FATTY ACIDS']],
  note: 'Nutrient specifications and inclusion levels should be confirmed for the intended species and formulation.',
  marketTag: 'APPLICATIONS', marketTitle: 'Nutrition for different feeding needs.',
  markets: [['01 / POULTRY', 'Backyard flocks', 'Offer an insect ingredient in feeding programs that reflect chickens’ natural foraging behavior.'], ['02 / AQUACULTURE', 'Fish nutrition', 'Explore BSFL ingredients as an alternative nutrient source for aquatic species.'], ['03 / ZOO & WILDLIFE', 'Specialist diets', 'Consider whole larvae for insect-eating species, with a species-specific nutrition plan.'], ['04 / YOUNG ANIMALS', 'Growing livestock', 'Discuss protein and energy requirements with a nutritionist before selecting the ingredient.']],
  processTag: 'CIRCULAR INGREDIENTS', processTitle: 'From food co-products<br><span class="bug-process-title-line">To animal nutrition</span>',
  process: [['Food co-products', 'Locally sourced inputs'], ['Black soldier fly larvae', 'Rearing and harvesting'], ['Oven drying', 'Whole dried format'], ['EnviroBug', 'Animal feed ingredient']],
  useTitle: 'Plan the application.', use: 'Whole dried larvae may be offered in suitable enrichment programs or co-ground for feed processing. Choose the format with your nutritionist; EnviroBug is an ingredient, not a complete diet.',
  use2: 'Contact CentroFarms™ for current availability, packaging, storage guidance and technical documentation.',
  research: 'READ MORE', researchTitle: 'Product sources & technical reading', researchNote: 'Manufacturer information and technical articles on BSFL nutrition. General research is not a guaranteed result for an individual product or feeding program.',
  related: 'Explore other products', closing: '<span class="bug-closing-line">Build your feeding program</span><br><span class="bug-closing-line">With EnviroBug</span>', closingText: 'Tell us your target species, formulation needs and expected volume.',
  description: 'Explore EnviroBug whole dried black soldier fly larvae: product format, animal nutrition applications and technical sources from EnviroFlight.'
 },
 vi: {
  tag: 'DINH DƯỠNG VẬT NUÔI · ẤU TRÙNG NGUYÊN CON SẤY KHÔ', intro: 'Ấu trùng nhỏ. Giá trị dinh dưỡng lớn.',
  lead: 'EnviroBug là ấu trùng ruồi lính đen (Hermetia illucens) nguyên con sấy khô bằng lò của EnviroFlight, giàu protein và cung cấp axit amin cùng axit béo.',
  sub: 'Khám phá nguyên liệu côn trùng cho chương trình dinh dưỡng vật nuôi, cùng thông tin sản phẩm và hỗ trợ ứng dụng từ CentroFarms™.',
  explore: 'Khám phá EnviroBug', contact: 'Yêu cầu thông tin sản phẩm', details: 'TỔNG QUAN SẢN PHẨM', title: 'Nguyên con.<br>Trọn nguồn dinh dưỡng.',
  overview: 'EnviroBug giữ dạng ấu trùng nguyên con sấy khô, kết hợp phần protein và chất béo trong cùng một nguyên liệu. EnviroMeal là dạng bột sau ép, còn EnviroOil là phần dầu được tách riêng.',
  overview2: 'Theo EnviroFlight, quy trình sấy không dùng hóa chất hay vi sóng. Khi đánh giá công thức, hãy yêu cầu tài liệu kỹ thuật và phiếu phân tích lô hàng hiện hành.',
  traits: [['Nguyên con', 'ẤU TRÙNG SẤY KHÔ'], ['Protein', 'AXIT AMIN'], ['Lipid', 'AXIT BÉO']],
  note: 'Cần xác nhận chỉ tiêu dinh dưỡng và mức bổ sung theo loài vật nuôi và công thức dự kiến.',
  marketTag: 'ỨNG DỤNG', marketTitle: 'Dinh dưỡng cho nhiều nhu cầu chăn nuôi.',
  markets: [['01 / GIA CẦM', 'Đàn gà thả vườn', 'Bổ sung nguyên liệu côn trùng vào chương trình cho ăn phù hợp tập tính tìm kiếm thức ăn tự nhiên của gà.'], ['02 / THỦY SẢN', 'Dinh dưỡng cho cá', 'Khám phá nguyên liệu từ ấu trùng ruồi lính đen như một nguồn dưỡng chất thay thế cho các loài thủy sản.'], ['03 / VƯỜN THÚ', 'Khẩu phần chuyên biệt', 'Cân nhắc ấu trùng nguyên con cho động vật ăn côn trùng, với kế hoạch dinh dưỡng riêng cho từng loài.'], ['04 / VẬT NUÔI NON', 'Giai đoạn tăng trưởng', 'Trao đổi với chuyên gia về nhu cầu protein và năng lượng trước khi lựa chọn nguyên liệu.']],
  processTag: 'NGUYÊN LIỆU TUẦN HOÀN', processTitle: 'Từ phụ phẩm thực phẩm đến dinh dưỡng vật nuôi.',
  process: [['Phụ phẩm thực phẩm', 'Nguồn đầu vào địa phương'], ['Ấu trùng ruồi lính đen', 'Nuôi và thu hoạch'], ['Sấy bằng lò', 'Giữ dạng nguyên con'], ['EnviroBug', 'Nguyên liệu thức ăn chăn nuôi']],
  useTitle: 'Lựa chọn cách ứng dụng.', use: 'Ấu trùng sấy khô có thể dùng trong hoạt động cho ăn khuyến khích tập tính tự nhiên hoặc nghiền cùng nguyên liệu khác để chế biến thức ăn. Chọn hình thức cùng chuyên gia dinh dưỡng; EnviroBug không phải thức ăn hoàn chỉnh.',
  use2: 'Liên hệ CentroFarms™ để nhận thông tin về khả năng cung ứng, đóng gói, bảo quản và hồ sơ kỹ thuật hiện hành.',
  research: 'TÌM HIỂU THÊM', researchTitle: 'Nguồn sản phẩm & tài liệu kỹ thuật', researchNote: 'Thông tin nhà sản xuất và bài viết kỹ thuật về dinh dưỡng từ ấu trùng ruồi lính đen. Nghiên cứu chung không phải cam kết hiệu quả cho từng sản phẩm hoặc chương trình cho ăn.',
  related: 'Khám phá các sản phẩm khác', closing: 'Xây dựng chương trình dinh dưỡng cùng EnviroBug.', closingText: 'Chia sẻ loài vật nuôi, yêu cầu công thức và sản lượng dự kiến của bạn.',
  description: 'Khám phá EnviroBug: ấu trùng ruồi lính đen nguyên con sấy khô, ứng dụng dinh dưỡng vật nuôi và tài liệu kỹ thuật từ EnviroFlight.'
 }
};
for (const lang of ['en', 'vi']) {
 const c = copy[lang], prefix = lang === 'vi' ? 'vi/' : '';
 const template = fs.readFileSync(prefix + 'agrisolutions/enviroflight/enviropro/index.html', 'utf8');
 const contact = prefix + 'contact/';
 const main = `<main><section class="page ax-page visible" id="page-agrisolution">
 <div class="shell intro-header"><div class="bread"><a href="${prefix || './'}">CentroFarms™</a><span>›</span><a href="${prefix}agrisolutions/enviroflight/">EnviroFlight ®</a><span>›</span><b>EnviroBug</b></div><div class="intro-tag">${c.tag}</div></div>
 <div class="shell ax-hero"><div class="ax-hero-copy"><span class="ax-label">CENTROFARMS™ ENVIROFLIGHT ®</span><h1>EnviroBug</h1><p>${c.lead}</p><p>${c.sub}</p><div class="ax-actions"><a class="ax-button" href="#agrisolution-details">${c.explore} <span>↓</span></a><a class="ax-text-link" href="${contact}">${c.contact} ↗</a></div><div class="ax-hero-footer">HERMETIA ILLUCENS · ENVIROFLIGHT ®</div></div><figure class="ax-hero-photo"><img src="img/envirobug.png" alt="${lang === 'vi' ? 'Ấu trùng ruồi lính đen nguyên con sấy khô EnviroBug' : 'EnviroBug whole dried black soldier fly larvae'}" fetchpriority="high"></figure></div>
 <section class="shell ax-section ax-product" id="agrisolution-details"><div class="ax-product-copy"><span class="ax-label">${c.details}</span><h2>${c.title}</h2><div class="ax-partner">EnviroFlight ® | Darling Ingredients</div><p>${c.overview}</p><p>${c.overview2}</p></div><div class="ax-product-panel bug-traits">${c.traits.map(([a,b],i)=>`<div class="bug-trait"><div class="bug-icon-badge">${icon(['larvae','protein','oil'][i])}</div><div><strong>${a}</strong><span>${b}</span></div></div>`).join('')}<p>${c.note}</p></div></section>
 <figure class="shell bug-ingredient-photo"><img src="img/envirobug/ingredients.jpg" width="1440" height="400" alt="${lang === 'vi' ? 'Các dạng nguyên liệu EnviroFlight: bột, ấu trùng nguyên con và dầu trong cốc thủy tinh' : 'EnviroFlight meal, whole dried larvae and oil in glass beakers'}" loading="lazy" decoding="async"><figcaption><span>${icon('larvae')} ${lang === 'vi' ? 'TỪ ẤU TRÙNG ĐẾN NGUYÊN LIỆU' : 'FROM LARVAE TO INGREDIENTS'}</span><span>EnviroFlight ® / Darling Ingredients</span></figcaption></figure>
 <section class="shell bug-section" aria-labelledby="bug-markets"><div class="agri-section-heading"><span class="section-overline">${c.marketTag}</span><h2 id="bug-markets">${c.marketTitle}</h2></div><div class="bug-market-grid">${c.markets.map(([a,b,d],i)=>`<article class="bug-market-card"><div class="bug-market-photo"><img src="img/envirobug/${marketImages[i]}" alt="${(lang === 'vi' ? ['Gà đi kiếm ăn trên lối gỗ','Cá bơi dưới nước','Tê tê trên cành cây','Đàn heo con ngoài trời'] : ['Chickens foraging on a wooden walkway','Catfish swimming underwater','Pangolin on a tree branch','Young piglets outdoors'])[i]}" width="854" height="480" loading="lazy" decoding="async"><span class="bug-market-symbol">${icon(marketIcons[i])}</span></div><div class="bug-market-copy"><span class="ax-label">${a}</span><h3>${b}</h3><p>${d}</p></div></article>`).join('')}</div></section>
 <section class="shell bug-section" aria-labelledby="bug-process"><div class="agri-section-heading"><span class="section-overline">${c.processTag}</span><h2 id="bug-process">${c.processTitle}</h2></div><ol class="bug-process">${c.process.map(([a,b],i)=>`<li><div class="bug-process-top"><span class="bug-icon-badge">${icon(processIcons[i])}</span><span class="bug-step">0${i+1}</span></div><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol></section>
 <section class="shell bug-use" aria-labelledby="bug-use-title"><figure class="bug-use-visual"><img src="img/envirobug/feeding-banner.jpg" width="1440" height="400" alt="${lang === 'vi' ? 'C?c giai ?o?n ph?t tri?n c?a ru?i l?nh ?en trong ?ng m?u t?i c? s? nghi?n c?u EnviroFlight' : 'Black soldier fly life stages in specimen tubes at EnviroFlight research'}" loading="lazy" decoding="async"></figure><div class="bug-use-content"><div class="bug-use-heading"><span class="section-overline">${lang === 'vi' ? 'Hướng Dẫn Ứng Dụng' : 'Feeding Guidance'}</span><h2 id="bug-use-title">${c.useTitle}</h2></div><div class="bug-use-copy"><p>${c.use}</p><p>${c.use2}</p><a class="ax-button" href="${contact}">${c.contact} <span aria-hidden="true">↗</span></a></div></div></section>
 <section class="shell enviro-related" aria-labelledby="enviro-related-title"><h2 id="enviro-related-title">${c.related}</h2><div class="enviro-related-grid">${['EnviroPro','EnviroMeal','EnviroOil','EnviroFeed'].map(name=>`<a class="enviro-related-card" href="${['EnviroPro','EnviroMeal','EnviroOil','EnviroFeed'].includes(name) ? prefix+'agrisolutions/enviroflight/'+name.toLowerCase()+'/' : prefix+'agrisolutions/enviroflight/'}"><img src="img/${name.toLowerCase()}.png" alt="${name}" loading="lazy"><span class="enviro-related-overlay"><span>${name}</span></span></a>`).join('')}</div></section>
 <div class="shell agri-closing"><div><span class="section-overline">CENTROFARMS™ AGRISOLUTIONS</span><h2>${c.closing}</h2><p>${c.closingText}</p></div><a class="solid-btn" href="${contact}">${c.contact} ↗</a></div>
 </section></main>`;
 const html = template.replace(/<main>[\s\S]*?<\/main>/, main).replaceAll('enviropro/', 'envirobug/').replace('data-page="enviropro"', 'data-page="envirobug"').replace(/<title>.*?<\/title>/, `<title>CentroFarms™ | EnviroBug${lang === 'vi' ? ' | VI' : ''}</title>`).replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${c.description}">`).replace('</head>', '<link rel="stylesheet" href="assets/envirobug.css"></head>');
 // Keep the related EnviroPro card pointing to the existing product page.
 let final = html.replace(/href="([^"]*)envirobug\/"(?=><img src="img\/enviropro.png")/, 'href="$1enviropro/"');
 if (lang === 'vi') final = final.replace('<link href="assets/site-vi.css"', '<link href="assets/site.css" rel="stylesheet"><link href="assets/site-vi.css"');
 const dest = prefix + 'agrisolutions/enviroflight/envirobug/index.html';
 fs.mkdirSync(path.dirname(dest), {recursive:true}); fs.writeFileSync(dest, titleCaseHeadings(final));
}
// Connect existing product cards to the detail page in each language.
for (const prefix of ['', 'vi/']) {
 for (const file of ['agrisolutions/index.html', 'agrisolutions/enviroflight/index.html', 'agrisolutions/enviroflight/enviropro/index.html']) {
  const target = prefix + file;
  const html = fs.readFileSync(target, 'utf8');
  const updated = html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g, anchor => {
   if (!anchor.includes('img/envirobug.png')) return anchor;
   return anchor.replace(/href="[^"]*"/, `href="${prefix}agrisolutions/enviroflight/envirobug/"`);
  });
  if (updated !== html) fs.writeFileSync(target, updated);
 }
}
