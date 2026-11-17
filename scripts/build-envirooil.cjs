const fs = require('node:fs');
const path = require('node:path');
const sources = {
 product: 'https://www.darlingii.com/enviroflight/products',
 markets: 'https://www.darlingii.com/enviroflight/markets',
 pigs: 'https://www.mdpi.com/2076-2615/12/23/3251',
 dogs: 'https://pubmed.ncbi.nlm.nih.gov/33585915/'
};
const symbols = {
 drop: '<path d="M12 3S5 11 5 15a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
 molecule: '<circle cx="6" cy="7" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m9 7 6-1M7 10l4 5m6-6-4 6"/>',
 energy: '<path d="m13 2-9 12h7l-1 8 10-13h-7l0-7Z"/>',
 press: '<path d="M4 3h16M12 3v7m-4-3 4 4 4-4M5 14h14v7H5z"/>',
 heat: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 14h8M8 7c-3-3 3-3 0-6m5 6c-3-3 3-3 0-6m5 6c-3-3 3-3 0-6"/>',
 grain: '<path d="M12 22V3m0 7C5 10 4 6 4 4c5 0 8 2 8 6Zm0 5c7 0 8-4 8-6-5 0-8 2-8 6Zm0 5c-7 0-8-4-8-6 5 0 8 2 8 6Z"/>',
 fish: '<path d="M3 12c4-7 11-7 15-2l4-4v12l-4-4c-4 5-11 5-15-2Z"/><circle cx="7" cy="11" r="1"/>',
 paw: '<ellipse cx="12" cy="16" rx="5" ry="4"/><ellipse cx="5" cy="9" rx="2" ry="3"/><ellipse cx="10" cy="5" rx="2" ry="3"/><ellipse cx="16" cy="5" rx="2" ry="3"/><ellipse cx="21" cy="10" rx="2" ry="3"/>',
 growth: '<path d="M4 20h16M7 16V9m5 7V5m5 11v-4M4 7l7-5 8 4"/>',
 poultry: '<path d="M5 11 2 5l6 3c3-5 8-4 9 0l4 2-4 2v3c0 4-4 5-7 4s-5-4-5-8Zm4 8-1 3m6-3 1 3"/>'
};
const icon = name => `<svg class="oil-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${symbols[name]}</svg>`;
const note = text => `<p class="note-block"><svg class="note-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v6h5M10 13h6m-6 4h6"/></svg><span class="note-content">${text}</span></p>`;
const copy = {
 en: {
  tag: 'Animal Nutrition · Insect-Derived Oil',
  lead: 'EnviroOil is the lipid fraction pressed from dried black soldier fly larvae. It brings an insect-derived source of fat and energy to animal feed formulations.',
  explore: 'Explore EnviroOil', contact: 'Request Product Information',
  heroAlt: 'Golden EnviroOil from black soldier fly larvae, photographed by EnviroFlight',
  introLabel: 'Product Overview', introTitle: 'A Different Source<br>Of Dietary Energy',
  intro: 'EnviroFlight identifies EnviroOil as a lauric-acid-rich oil. Evaluate the fatty acid profile alongside the energy and processing requirements of your formula.',
  intro2: 'EnviroOil is the separated oil fraction; EnviroMeal is the protein-rich meal after pressing, while EnviroBug retains the whole dried larvae format.',
  traits: [['Lipids','Dietary Energy','energy'],['Lauric Acid','Fatty Acid Profile','molecule'],['Pressed Oil','Larvae-Derived','drop']],
  specNote: 'Confirm current fatty acid composition, quality specifications and inclusion levels with your nutritionist before formulation.',
  processLabel: 'From Larvae To Lipids', processTitle: 'One Process<br>Two Useful Fractions',
  process: [['Rearing','Larvae grow on suitable feed inputs','grain'],['Drying','Larvae are dried before extraction','heat'],['Pressing','Mechanical pressing separates the oil','press']],
  oilBranch: 'EnviroOil', oilBranchText: 'Oil fraction · dietary fat', mealBranch: 'EnviroMeal', mealBranchText: 'Pressed meal · protein ingredient',
  marketLabel: 'Applications', marketTitle: 'Fat And Energy<br>Across Feeding Programs',
  markets: [['Young Animals','Consider energy density when developing nursery and growth-stage diets.','growth'],['Pet Food','Assess the oil within a species-appropriate, nutritionally complete formulation.','paw'],['Aquaculture','Explore alternative lipid sources alongside the full fatty acid requirements of the fish.','fish'],['Poultry','Evaluate dietary fat alongside protein, minerals and other feed ingredients.','poultry']],
  researchLabel: 'Research In Practice', researchTitle: 'Studied In Animal Nutrition',
  photoAlt: 'Nursery pigs eating at a feeder, contextual image from an article about black soldier fly larvae oil',
  research: [['01 / Nursery Pigs','Growth & Feed Efficiency','A 40-day study published in 2022 evaluated BSFL oil replacing corn oil in nursery pig diets. The authors reported improved daily gain and feed efficiency under the trial conditions.','van Heugten et al · 2022',sources.pigs],['02 / Adult Dogs','Acceptance & Digestibility','A 2021 study tested BSFL oil in extruded diets for adult dogs. Diets were accepted and nutrient digestibility and general health were maintained within the study conditions.','Freel et al · 2021',sources.dogs]],
  researchNote: 'Research outcomes depend on the species, formulation and trial conditions. Study inclusion levels are not universal feeding directions.',
  guidanceLabel: 'Formulation Guidance', guidanceTitle: 'Plan For Your Process',
  guidance: [['Nutrient Profile','Request the current fatty acid profile and batch analysis.'],['Handling & Storage','Confirm storage conditions, temperature requirements and handling guidance with the supplier.'],['Diet Formulation','Balance energy and essential fatty acids with the other ingredients in the diet.']],
  completeNote: 'EnviroOil is a feed ingredient, not a complete diet. Contact CentroFarms™ for current availability, packaging and technical documentation.',
  related: 'Explore Other Products', closing: 'Explore Lipid Nutrition', productLine: 'With EnviroOil', closingText: 'Tell us your target species, formulation needs and expected volume.',
  description: 'EnviroOil black soldier fly larvae oil: product overview, fatty acid considerations, animal feed applications, research and formulation support from CentroFarms.'
 },
 vi: {
  tag: 'Dinh Dưỡng Vật Nuôi · Dầu Từ Côn Trùng',
  lead: 'EnviroOil là phần dầu ép từ ấu trùng ruồi lính đen sấy khô, cung cấp chất béo và năng lượng có nguồn gốc côn trùng cho công thức thức ăn vật nuôi.',
  explore: 'Khám Phá EnviroOil', contact: 'Yêu Cầu Thông Tin Sản Phẩm',
  heroAlt: 'Dầu EnviroOil màu vàng từ ấu trùng ruồi lính đen, ảnh của EnviroFlight',
  introLabel: 'Tổng Quan Sản Phẩm', introTitle: 'Nguồn Năng Lượng<br>Cho Khẩu Phần',
  intro: 'Theo EnviroFlight, EnviroOil giàu axit lauric. Cần đánh giá thành phần axit béo cùng nhu cầu năng lượng và yêu cầu chế biến của công thức.',
  intro2: 'EnviroOil là phần dầu được tách riêng; EnviroMeal là bột giàu protein sau ép, còn EnviroBug giữ dạng ấu trùng nguyên con sấy khô.',
  traits: [['Lipid','Năng Lượng Khẩu Phần','energy'],['Axit Lauric','Thành Phần Axit Béo','molecule'],['Dầu Ép','Từ Ấu Trùng','drop']],
  specNote: 'Xác nhận thành phần axit béo, chỉ tiêu chất lượng và mức bổ sung hiện hành cùng chuyên gia dinh dưỡng trước khi phối trộn.',
  processLabel: 'Từ Ấu Trùng Đến Dầu', processTitle: 'Một Quy Trình<br>Hai Phần Nguyên Liệu',
  process: [['Nuôi Ấu Trùng','Ấu trùng phát triển từ nguồn thức ăn phù hợp','grain'],['Sấy Khô','Sấy ấu trùng trước khi tách dầu','heat'],['Ép Tách','Ép cơ học để tách phần dầu','press']],
  oilBranch: 'EnviroOil', oilBranchText: 'Phần dầu · chất béo khẩu phần', mealBranch: 'EnviroMeal', mealBranchText: 'Phần bột · nguyên liệu protein',
  marketLabel: 'Ứng Dụng', marketTitle: 'Chất Béo Và Năng Lượng<br>Cho Nhiều Khẩu Phần',
  markets: [['Vật Nuôi Non','Cân nhắc mật độ năng lượng khi xây dựng khẩu phần cho giai đoạn sau cai sữa và tăng trưởng.','growth'],['Thú Cưng','Đánh giá dầu trong công thức hoàn chỉnh, phù hợp với từng loài vật nuôi.','paw'],['Thủy Sản','Khám phá nguồn lipid thay thế cùng yêu cầu đầy đủ về axit béo của loài cá.','fish'],['Gia Cầm','Đánh giá chất béo cùng protein, khoáng chất và các nguyên liệu khác trong thức ăn.','poultry']],
  researchLabel: 'Nghiên Cứu Ứng Dụng', researchTitle: 'Nghiên Cứu Trong Dinh Dưỡng Vật Nuôi',
  photoAlt: 'Heo con ăn tại máng, ảnh minh họa từ bài viết về dầu ấu trùng ruồi lính đen',
  research: [['01 / Heo Con','Tăng Trưởng & Hiệu Quả Thức Ăn','Nghiên cứu 40 ngày công bố năm 2022 đánh giá dầu ấu trùng thay dầu ngô trong khẩu phần heo con. Tác giả ghi nhận cải thiện tăng trọng và hiệu quả thức ăn trong điều kiện thử nghiệm.','van Heugten và cộng sự · 2022',sources.pigs],['02 / Chó Trưởng Thành','Tiếp Nhận & Tiêu Hóa','Nghiên cứu năm 2021 thử nghiệm dầu ấu trùng trong thức ăn ép đùn cho chó trưởng thành. Khẩu phần được tiếp nhận, khả năng tiêu hóa và sức khỏe chung được duy trì trong điều kiện nghiên cứu.','Freel và cộng sự · 2021',sources.dogs]],
  researchNote: 'Kết quả phụ thuộc loài vật nuôi, công thức và điều kiện thử nghiệm. Mức bổ sung trong nghiên cứu không phải hướng dẫn cho ăn áp dụng chung.',
  guidanceLabel: 'Hướng Dẫn Phối Trộn', guidanceTitle: 'Chuẩn Bị Cho Quy Trình Của Bạn',
  guidance: [['Thành Phần Dinh Dưỡng','Yêu cầu bảng axit béo và phiếu phân tích lô hàng hiện hành.'],['Xử Lý & Bảo Quản','Xác nhận điều kiện bảo quản, yêu cầu nhiệt độ và hướng dẫn xử lý với nhà cung cấp.'],['Công Thức Khẩu Phần','Cân đối năng lượng và axit béo thiết yếu cùng các nguyên liệu còn lại.']],
  completeNote: 'EnviroOil là nguyên liệu, không phải thức ăn hoàn chỉnh. Liên hệ CentroFarms™ để nhận thông tin cung ứng, đóng gói và hồ sơ kỹ thuật hiện hành.',
  related: 'Khám Phá Các Sản Phẩm Khác', closing: 'Khám Phá Dinh Dưỡng Lipid', productLine: 'Cùng EnviroOil', closingText: 'Chia sẻ loài vật nuôi, yêu cầu công thức và sản lượng dự kiến của bạn.',
  description: 'EnviroOil: dầu ấu trùng ruồi lính đen, thành phần axit béo, ứng dụng thức ăn vật nuôi, nghiên cứu và hỗ trợ phối trộn từ CentroFarms.'
 }
};

for (const lang of ['en','vi']) {
 const c=copy[lang], prefix=lang==='vi'?'vi/':'';
 const contact=prefix+'contact/';
 const main=`<main><section class="page visible oil-page" id="page-agrisolution">
 <div class="shell intro-header"><div class="bread"><a href="${prefix||'./'}">CentroFarms™</a><span>›</span><a href="${prefix}agrisolutions/enviroflight/">EnviroFlight ®</a><span>›</span><b>EnviroOil</b></div><div class="intro-tag">${c.tag}</div></div>
 <section class="shell oil-hero" aria-labelledby="oil-title"><div class="oil-hero-top"><div><span class="oil-label">CentroFarms™ EnviroFlight ®</span><h1 id="oil-title">EnviroOil</h1></div><div class="oil-hero-intro"><p>${c.lead}</p><a class="oil-link" href="#oil-overview">${c.explore} ↓</a></div></div><div class="oil-hero-art"><img src="img/envirooil/oil.png" width="854" height="480" alt="${c.heroAlt}" fetchpriority="high"><div class="oil-image-label">Hermetia illucens <span>EnviroFlight ® / Darling Ingredients</span></div></div></section>
 <section class="shell oil-section oil-overview" id="oil-overview"><div class="oil-overview-heading"><span class="oil-label">${c.introLabel}</span><h2>${c.introTitle}</h2></div><div class="oil-overview-copy"><p>${c.intro}</p><p>${c.intro2}</p></div><div class="oil-traits">${c.traits.map(([a,b,symbol])=>`<article><span class="oil-icon-circle">${icon(symbol)}</span><h3>${a}</h3><p>${b}</p></article>`).join('')}</div>${note(c.specNote)}</section>
 <section class="shell oil-section oil-extraction" aria-labelledby="oil-process"><div><span class="oil-label">${c.processLabel}</span><h2 id="oil-process">${c.processTitle}</h2></div><div class="oil-extraction-diagram"><ol>${c.process.map(([a,b,symbol],i)=>`<li><span class="oil-process-symbol">${icon(symbol)}</span><span class="oil-step">0${i+1}</span><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol><div class="oil-branches"><a href="#oil-overview" class="oil-branch-active">${icon('drop')}<span><strong>${c.oilBranch}</strong><small>${c.oilBranchText}</small></span></a><a href="${prefix}agrisolutions/enviroflight/enviromeal/">${icon('molecule')}<span><strong>${c.mealBranch}</strong><small>${c.mealBranchText}</small></span><span aria-hidden="true">↗</span></a></div></div></section>
 <section class="shell oil-section oil-markets" aria-labelledby="oil-markets"><div><span class="oil-label">${c.marketLabel}</span><h2 id="oil-markets">${c.marketTitle}</h2></div><div class="oil-market-grid">${c.markets.map(([a,b,symbol],i)=>`<article><div class="oil-market-top">${icon(symbol)}<span>0${i+1}</span></div><h3>${a}</h3><p>${b}</p></article>`).join('')}</div></section>
 <section class="shell oil-section oil-research" aria-labelledby="oil-research"><div class="oil-research-heading"><span class="oil-label">${c.researchLabel}</span><h2 id="oil-research">${c.researchTitle}</h2></div><div class="oil-research-layout"><figure><img src="img/envirooil/nursery-feeding.jpg" width="1280" height="664" alt="${c.photoAlt}" loading="lazy" decoding="async"><figcaption>${lang==='vi'?'Dầu Ấu Trùng Trong Dinh Dưỡng Heo Con':'Larvae Oil In Nursery Pig Nutrition'}</figcaption></figure><div class="oil-studies">${c.research.map(([label,title,text,credit,url])=>`<article><span class="oil-label">${label}</span><h3>${title}</h3><p>${text}</p><a class="oil-link" href="${url}" target="_blank" rel="noopener noreferrer">${credit} ↗</a></article>`).join('')}</div></div>${note(c.researchNote)}</section>
 <section class="shell oil-section oil-guidance" aria-labelledby="oil-guidance"><div><span class="oil-label">${c.guidanceLabel}</span><h2 id="oil-guidance">${c.guidanceTitle}</h2><a class="oil-button" href="${contact}">${c.contact} ↗</a></div><ol>${c.guidance.map(([a,b],i)=>`<li><span>0${i+1}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ol>${note(c.completeNote)}</section>
 <section class="shell oil-section enviro-related" aria-labelledby="oil-related"><h2 id="oil-related">${c.related}</h2><div class="enviro-related-grid">${['EnviroBug','EnviroMeal','EnviroPro','EnviroFeed'].map(name=>`<a class="enviro-related-card" href="${prefix}agrisolutions/enviroflight/${name.toLowerCase()+'/'}" aria-label="${name}"><img src="img/${name.toLowerCase()}.png" alt="${name}" loading="lazy"><span class="enviro-related-overlay"><span>${name}</span></span></a>`).join('')}</div></section>
 <div class="shell oil-section oil-closing"><div><span class="oil-label">CentroFarms™ AgriSolutions</span><h2>${c.closing}<br>${c.productLine}</h2><p>${c.closingText}</p></div><a class="oil-button oil-button-light" href="${contact}">${c.contact} ↗</a></div>
 </section></main>`;
 let html=fs.readFileSync(prefix+'agrisolutions/enviroflight/envirobug/index.html','utf8');
 html=html.replaceAll('envirobug/','envirooil/').replace('data-page="envirobug"','data-page="envirooil"').replace(/<main>[\s\S]*?<\/main>/,main).replace(/<title>.*?<\/title>/,`<title>CentroFarms™ | EnviroOil${lang==='vi'?' | VI':''}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${c.description}">`).replace('<link rel="stylesheet" href="assets/envirobug.css">','<link rel="stylesheet" href="assets/envirooil.css">');
 const dest=prefix+'agrisolutions/enviroflight/envirooil/index.html';
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html);
}

for(const prefix of ['', 'vi/']) {
 for(const file of ['agrisolutions/index.html','agrisolutions/enviroflight/index.html','agrisolutions/enviroflight/envirobug/index.html','agrisolutions/enviroflight/enviromeal/index.html','agrisolutions/enviroflight/enviropro/index.html']) {
  const target=prefix+file, html=fs.readFileSync(target,'utf8');
  const updated=html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,a=>a.includes('img/envirooil.png')?a.replace(/href="[^"]*"/,`href="${prefix}agrisolutions/enviroflight/envirooil/"`):a);
  if(updated!==html)fs.writeFileSync(target,updated);
 }
}
fs.writeFileSync('img/envirooil/research-sources.json',JSON.stringify(sources,null,2));
