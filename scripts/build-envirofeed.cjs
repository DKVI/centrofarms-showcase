const fs=require('node:fs');
const path=require('node:path');
const sources={
 product:'https://www.darlingii.com/enviroflight/products',
 markets:'https://www.darlingii.com/enviroflight/markets',
 broilers:'https://doi.org/10.1016/j.japr.2024.100493',
 pigs:'https://pmc.ncbi.nlm.nih.gov/articles/PMC12091431/',
 pigsProduct:'https://www.nationalhogfarmer.com/livestock-management/using-frass-from-blacks-soldier-fly-larvae-in-nursery-pig-diets'
};
const shapes={
 cycle:'<path d="M20 8a9 9 0 0 0-15-3L2 8m0-5v5h5m-3 8a9 9 0 0 0 15 3l3-3m-5 0h5v5"/>',
 grain:'<path d="M12 22V3m0 7C5 10 4 6 4 4c5 0 8 2 8 6Zm0 5c7 0 8-4 8-6-5 0-8 2-8 6Zm0 5c-7 0-8-4-8-6 5 0 8 2 8 6Z"/>',
 protein:'<circle cx="6" cy="7" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m9 7 6-1M7 10l4 5m6-6-4 6"/>',
 shield:'<path d="m12 3 8 3v6c0 5-8 10-8 10S4 17 4 12V6l8-3Z"/><path d="m8 12 3 3 5-6"/>',
 poultry:'<path d="M5 11 2 5l6 3c3-5 8-4 9 0l4 2-4 2v3c0 4-4 5-7 4s-5-4-5-8Zm4 8-1 3m6-3 1 3"/>',
 growth:'<path d="M4 20h16M7 16V9m5 7V5m5 11v-4M4 7l7-5 8 4"/>',
 larvae:'<path d="M6 17c-3-3-2-7 1-9 2-2 4-1 5 1s3 1 4 0 4-1 5 2-1 6-4 6H6Z"/><path d="m7 9 1 7m4-6 1 7m4-7 1 6"/>'
};
const icon=name=>`<svg class="feed-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes[name]}</svg>`;
const note=text=>`<p class="note-block"><svg class="note-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v6h5M10 13h6m-6 4h6"/></svg><span class="note-content">${text}</span></p>`;
const content={
 en:{
  tag:'Animal Nutrition · BSFL Production Co-Product',
  lead:'EnviroFeed is a nutrient-containing co-product of EnviroFlight’s black soldier fly larvae production, developed as an ingredient for animal feed.',
  explore:'Explore EnviroFeed',contact:'Request Product Information',
  heroAlt:'Close-up of the granular EnviroFeed ingredient from EnviroFlight',
  heroCaption:'EnviroFeed / EnviroFlight ®',
  overviewLabel:'Product Overview',overviewTitle:'More Value From<br>The Larvae System',
  overview:'EnviroFeed is the frass-based feed co-product from BSFL production. Frass includes residual feed material, larval excretions and shed exoskeletons; its composition depends on the feedstock and production process.',
  overview2:'The manufacturer describes protein, carbohydrates and lauric acid, alongside chitin and antimicrobial peptides. Assess these components using current product specifications.',
  features:[['Nutrients','Protein & Carbohydrates','protein'],['Components','Chitin & Lauric Acid','shield'],['Co-Product','Circular Ingredient','cycle']],
  specNote:'Confirm the feed ingredient specification, batch analysis and species-appropriate inclusion level. EnviroPro is a separate product for plant nutrition.',
  originLabel:'Circular Production',originTitle:'A Co-Product<br>With A Feeding Role',
  origin:[['Feed Inputs','Suitable feedstocks support larvae production','grain'],['Larvae Rearing','Larvae grow and transform the feed material','larvae'],['Feed Co-Product','The residual stream is evaluated for animal nutrition','cycle']],
  originNote:'Feedstock, processing and quality controls influence the nutritional value of each frass source.',
  marketsLabel:'Application Focus',marketsTitle:'Start With The Species<br>And The Complete Diet',
  markets:[['01 / Poultry','Broiler Feed Formulation','Research has evaluated BSFL frass within balanced broiler diets. Consider nutrient contribution alongside amino acids, fiber and energy.','poultry'],['02 / Young Animals','Nursery Pig Nutrition','Evaluate frass in the context of digestible nutrients, fiber tolerance and the rest of the nursery formulation.','growth']],
  researchLabel:'Research In Practice',researchTitle:'What The Studies Report',
  research:[['2024','Broiler Diets','Two experiments compared balanced diets with and without BSFL frass. Feed intake, weight gain and feed conversion did not differ significantly under the tested conditions.','Adams & Koutsos · 2024',sources.broilers],['2025','Nursery Pig Diets','A six-week conference study evaluated increasing frass inclusion. Growth performance and diarrhea incidence were not significantly affected in the tested diets.','Rubio et al · 2025 · Conference Abstract',sources.pigs]],
  researchNote:'Results apply to the specific frass source, diets and trial conditions. Research inclusion levels are not general feeding directions or guaranteed performance improvements.',
  guidanceLabel:'Formulation Guidance',guidanceTitle:'Evaluate Before<br>You Formulate',
  guidance:[['Composition','Request current protein, fat, fiber, ash and mineral specifications.'],['Application','Balance digestible nutrients for the target species and life stage.'],['Supply','Confirm packaging, storage, availability and batch documentation.']],
  guidanceNote:'EnviroFeed is an ingredient, not a complete feed. Work with a qualified nutritionist to establish its role in the finished diet.',
  related:'Explore Other Products',closing:'Connect Circular Production',productLine:'With EnviroFeed',closingText:'Share your target species, formulation needs and expected volume.',
  description:'Explore EnviroFeed, EnviroFlight’s BSFL production feed co-product: ingredient profile, broiler and nursery pig research, and formulation guidance from CentroFarms.'
 },
 vi:{
  tag:'Dinh Dưỡng Vật Nuôi · Đồng Sản Phẩm Nuôi Ấu Trùng',
  lead:'EnviroFeed là đồng sản phẩm chứa dưỡng chất từ quá trình nuôi ấu trùng ruồi lính đen của EnviroFlight, được phát triển làm nguyên liệu thức ăn vật nuôi.',
  explore:'Khám Phá EnviroFeed',contact:'Yêu Cầu Thông Tin Sản Phẩm',
  heroAlt:'Cận cảnh nguyên liệu EnviroFeed dạng hạt từ EnviroFlight',
  heroCaption:'EnviroFeed / EnviroFlight ®',
  overviewLabel:'Tổng Quan Sản Phẩm',overviewTitle:'Tận Dụng Giá Trị<br>Từ Hệ Thống Nuôi Ấu Trùng',
  overview:'EnviroFeed là đồng sản phẩm dùng cho thức ăn từ phần frass trong hệ thống nuôi ấu trùng. Frass gồm nguyên liệu thức ăn còn lại, chất bài tiết và vỏ lột; thành phần phụ thuộc nguồn thức ăn và quy trình sản xuất.',
  overview2:'Nhà sản xuất mô tả protein, carbohydrate và axit lauric, cùng chitin và peptide kháng khuẩn. Cần đánh giá các thành phần này theo thông số sản phẩm hiện hành.',
  features:[['Dưỡng Chất','Protein & Carbohydrate','protein'],['Thành Phần','Chitin & Axit Lauric','shield'],['Đồng Sản Phẩm','Nguyên Liệu Tuần Hoàn','cycle']],
  specNote:'Xác nhận thông số nguyên liệu thức ăn, phiếu phân tích lô hàng và mức bổ sung phù hợp từng loài. EnviroPro là sản phẩm riêng cho dinh dưỡng cây trồng.',
  originLabel:'Sản Xuất Tuần Hoàn',originTitle:'Đồng Sản Phẩm<br>Cho Dinh Dưỡng Vật Nuôi',
  origin:[['Nguồn Thức Ăn','Nguồn đầu vào phù hợp phục vụ quá trình nuôi','grain'],['Nuôi Ấu Trùng','Ấu trùng phát triển và chuyển hóa thức ăn','larvae'],['Đồng Sản Phẩm','Đánh giá phần vật chất còn lại cho dinh dưỡng vật nuôi','cycle']],
  originNote:'Nguồn thức ăn, chế biến và kiểm soát chất lượng ảnh hưởng đến giá trị dinh dưỡng của từng nguồn frass.',
  marketsLabel:'Trọng Tâm Ứng Dụng',marketsTitle:'Bắt Đầu Từ Loài Vật Nuôi<br>Và Khẩu Phần Hoàn Chỉnh',
  markets:[['01 / Gia Cầm','Công Thức Cho Gà Thịt','Nghiên cứu đã đánh giá frass trong khẩu phần gà thịt cân đối. Cần xem xét đóng góp dinh dưỡng cùng axit amin, chất xơ và năng lượng.','poultry'],['02 / Vật Nuôi Non','Dinh Dưỡng Heo Con','Đánh giá frass theo dưỡng chất tiêu hóa, khả năng dung nạp chất xơ và các nguyên liệu còn lại trong công thức.','growth']],
  researchLabel:'Nghiên Cứu Ứng Dụng',researchTitle:'Kết Quả Được Báo Cáo',
  research:[['2024','Khẩu Phần Gà Thịt','Hai thử nghiệm so sánh khẩu phần cân đối có và không có frass. Lượng ăn, tăng trọng và chuyển hóa thức ăn không khác biệt có ý nghĩa trong điều kiện thử nghiệm.','Adams & Koutsos · 2024',sources.broilers],['2025','Khẩu Phần Heo Con','Nghiên cứu hội nghị kéo dài sáu tuần đánh giá các mức frass tăng dần. Tăng trưởng và tỷ lệ tiêu chảy không bị ảnh hưởng có ý nghĩa trong các khẩu phần thử nghiệm.','Rubio và cộng sự · 2025 · Tóm Tắt Hội Nghị',sources.pigs]],
  researchNote:'Kết quả áp dụng cho nguồn frass, khẩu phần và điều kiện thử nghiệm cụ thể. Mức bổ sung nghiên cứu không phải hướng dẫn cho ăn chung hoặc cam kết cải thiện hiệu quả.',
  guidanceLabel:'Hướng Dẫn Phối Trộn',guidanceTitle:'Đánh Giá Trước<br>Khi Xây Dựng Công Thức',
  guidance:[['Thành Phần','Yêu cầu thông số hiện hành về protein, chất béo, chất xơ, tro và khoáng chất.'],['Ứng Dụng','Cân đối dưỡng chất tiêu hóa theo loài và giai đoạn sống.'],['Cung Ứng','Xác nhận đóng gói, bảo quản, nguồn cung và hồ sơ lô hàng.']],
  guidanceNote:'EnviroFeed là nguyên liệu, không phải thức ăn hoàn chỉnh. Trao đổi cùng chuyên gia dinh dưỡng để xác định vai trò trong khẩu phần cuối cùng.',
  related:'Khám Phá Các Sản Phẩm Khác',closing:'Kết Nối Sản Xuất Tuần Hoàn',productLine:'Cùng EnviroFeed',closingText:'Chia sẻ loài vật nuôi, yêu cầu công thức và sản lượng dự kiến của bạn.',
  description:'Khám phá EnviroFeed, đồng sản phẩm nuôi ấu trùng của EnviroFlight dùng cho thức ăn vật nuôi: thành phần, nghiên cứu gà thịt, heo con và hướng dẫn phối trộn từ CentroFarms.'
 }
};
for(const lang of ['en','vi']){
 const c=content[lang],prefix=lang==='vi'?'vi/':'',contact=prefix+'contact/';
 const main=`<main><section class="page visible feed-page" id="page-agrisolution">
 <div class="shell intro-header"><div class="bread"><a href="${prefix||'./'}">CentroFarms™</a><span>›</span><a href="${prefix}agrisolutions/enviroflight/">EnviroFlight ®</a><span>›</span><b>EnviroFeed</b></div><div class="intro-tag">${c.tag}</div></div>
 <section class="shell feed-hero" aria-labelledby="feed-title"><figure><img src="img/envirofeed/feed.png" width="854" height="480" alt="${c.heroAlt}" fetchpriority="high"><figcaption>${c.heroCaption}</figcaption></figure><div class="feed-hero-copy"><span class="feed-label">CentroFarms™ EnviroFlight ®</span><h1 id="feed-title">EnviroFeed</h1><p>${c.lead}</p><a class="feed-button" href="#feed-overview">${c.explore} ↓</a></div></section>
 <section class="shell feed-section feed-overview" id="feed-overview"><div><span class="feed-label">${c.overviewLabel}</span><h2>${c.overviewTitle}</h2></div><div class="feed-overview-text"><p>${c.overview}</p><p>${c.overview2}</p></div><div class="feed-components">${c.features.map(([a,b,symbol])=>`<article><span class="feed-icon-badge">${icon(symbol)}</span><h3>${a}</h3><p>${b}</p></article>`).join('')}</div>${note(c.specNote)}</section>
 <section class="shell feed-section feed-origin" aria-labelledby="feed-origin"><div class="feed-origin-heading"><span class="feed-label">${c.originLabel}</span><h2 id="feed-origin">${c.originTitle}</h2><p>${c.originNote}</p></div><ol>${c.origin.map(([a,b,symbol],i)=>`<li><div class="feed-step-icon">${icon(symbol)}<span>0${i+1}</span></div><h3>${a}</h3><p>${b}</p></li>`).join('')}</ol></section>
 <section class="shell feed-section" aria-labelledby="feed-markets"><span class="feed-label">${c.marketsLabel}</span><h2 id="feed-markets">${c.marketsTitle}</h2><div class="feed-applications">${c.markets.map(([label,title,text,symbol])=>`<article><span class="feed-label">${label}</span><div class="feed-application-heading">${icon(symbol)}<h3>${title}</h3></div><p>${text}</p></article>`).join('')}</div></section>
 <section class="shell feed-section feed-research" aria-labelledby="feed-research"><div class="feed-research-heading"><span class="feed-label">${c.researchLabel}</span><h2 id="feed-research">${c.researchTitle}</h2></div><div class="feed-study-list">${c.research.map(([year,title,text,credit,url])=>`<article><span class="feed-study-year">${year}</span><div><h3>${title}</h3><p>${text}</p><a class="feed-link" href="${url}" target="_blank" rel="noopener noreferrer">${credit} ↗</a></div></article>`).join('')}</div>${note(c.researchNote)}</section>
 <section class="shell feed-section feed-guidance" aria-labelledby="feed-guidance"><div><span class="feed-label">${c.guidanceLabel}</span><h2 id="feed-guidance">${c.guidanceTitle}</h2><a class="feed-button" href="${contact}">${c.contact} ↗</a></div><ol>${c.guidance.map(([a,b],i)=>`<li><span>0${i+1}</span><div><h3>${a}</h3><p>${b}</p></div></li>`).join('')}</ol>${note(c.guidanceNote)}</section>
 <section class="shell feed-section enviro-related" aria-labelledby="feed-related"><h2 id="feed-related">${c.related}</h2><div class="enviro-related-grid">${['EnviroBug','EnviroMeal','EnviroOil','EnviroPro'].map(name=>`<a class="enviro-related-card" href="${prefix}agrisolutions/enviroflight/${name.toLowerCase()}/" aria-label="${name}"><img src="img/${name.toLowerCase()}.png" alt="${name}" loading="lazy"><span class="enviro-related-overlay"><span>${name}</span></span></a>`).join('')}</div></section>
 <div class="shell feed-section feed-closing"><div><span class="feed-label">CentroFarms™ AgriSolutions</span><h2>${c.closing}<br>${c.productLine}</h2><p>${c.closingText}</p></div><a class="feed-button feed-button-light" href="${contact}">${c.contact} ↗</a></div>
 </section></main>`;
 let html=fs.readFileSync(prefix+'agrisolutions/enviroflight/envirobug/index.html','utf8');
 html=html.replaceAll('envirobug/','envirofeed/').replace('data-page="envirobug"','data-page="envirofeed"').replace(/<main>[\s\S]*?<\/main>/,main).replace(/<title>.*?<\/title>/,`<title>CentroFarms™ | EnviroFeed${lang==='vi'?' | VI':''}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${c.description}">`).replace('<link rel="stylesheet" href="assets/envirobug.css">','<link rel="stylesheet" href="assets/envirofeed.css">');
 const file=prefix+'agrisolutions/enviroflight/envirofeed/index.html';fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);
}
for(const prefix of ['', 'vi/'])for(const file of ['agrisolutions/index.html','agrisolutions/enviroflight/index.html',...['envirobug','enviromeal','envirooil','enviropro'].map(name=>'agrisolutions/enviroflight/'+name+'/index.html')]){
 const target=prefix+file,html=fs.readFileSync(target,'utf8');
 const result=html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,a=>a.includes('img/envirofeed.png')?a.replace(/href="[^"]*"/,`href="${prefix}agrisolutions/enviroflight/envirofeed/"`):a);
 if(result!==html)fs.writeFileSync(target,result);
}
fs.writeFileSync('img/envirofeed/research-sources.json',JSON.stringify(sources,null,2));
