const fs = require('node:fs');
const path = require('node:path');

const sources = {
 product: 'https://www.darlingii.com/enviroflight/products',
 markets: 'https://www.darlingii.com/enviroflight/markets',
 dogs: 'https://pubmed.ncbi.nlm.nih.gov/33585915/',
 salmon: 'https://kosmospublishers.com/wp-content/uploads/2023/04/Evaluation-of-ME-PRO%C2%AE-and-EnviroMeal-Combinations-as-Partial-and-Complete-Fish-Meal-Replacements-in-Diets-for-Juvenile-Atlantic-Salmon-Salmo-salar-Reared-in-A-Recirculating-Aquaculture-System.pdf'
};
const icons = {
 protein: '<circle cx="6" cy="7" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><path d="m9 7 6-1M7 10l4 5m6-6-4 6"/>',
 meal: '<path d="M3 14h18l-3 7H6l-3-7Zm3-4h12M8 6h8M11 2h2"/>',
 press: '<path d="M4 3h16M12 3v7m-4-3 4 4 4-4M5 14h14v7H5z"/>',
 fish: '<path d="M3 12c4-7 11-7 15-2l4-4v12l-4-4c-4 5-11 5-15-2Z"/><circle cx="7" cy="11" r="1"/>',
 poultry: '<path d="M5 11 2 5l6 3c3-5 8-4 9 0l4 2-4 2v3c0 4-4 5-7 4s-5-4-5-8Zm4 8-1 3m6-3 1 3"/>',
 paw: '<ellipse cx="12" cy="16" rx="5" ry="4"/><ellipse cx="5" cy="9" rx="2" ry="3"/><ellipse cx="10" cy="5" rx="2" ry="3"/><ellipse cx="16" cy="5" rx="2" ry="3"/><ellipse cx="21" cy="10" rx="2" ry="3"/>',
 growth: '<path d="M4 20h16M7 16V9m5 7V5m5 11v-4M4 7l7-5 8 4"/>',
 grain: '<path d="M12 22V3m0 7C5 10 4 6 4 4c5 0 8 2 8 6Zm0 5c7 0 8-4 8-6-5 0-8 2-8 6Zm0 5c-7 0-8-4-8-6 5 0 8 2 8 6Z"/>'
};
const icon = name => `<svg class="bug-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
const content = {
 en: {
  tag: 'Animal Nutrition · Insect Protein Meal',
  lead: 'EnviroMeal is a finely ground black soldier fly larvae ingredient from EnviroFlight, produced by pressing part of the fat from dried larvae.',
  sub: 'Explore insect protein for formulated feeds, with product documentation and application support from CentroFarms™.',
  explore: 'Explore EnviroMeal', contact: 'Request Product Information', overviewLabel: 'Product Overview',
  overviewTitle: 'Insect Protein<br>For Your Formulation',
  overview: 'EnviroFlight describes EnviroMeal as a protein-rich, palatable and digestible ingredient that supplies amino acids. Its fine meal format differs from EnviroBug’s whole dried larvae and EnviroOil’s separated lipid fraction.',
  overview2: 'Evaluate it as part of a balanced formula, using the current specification sheet for protein, residual fat, moisture and amino acid composition.',
  traits: [['Protein','Amino Acids'],['Fine Meal','Ground Format'],['Pressed','Partially Defatted']],
  note: 'Confirm current specifications and the appropriate inclusion level for your target species before formulation.',
  marketTitle: 'One Ingredient<br>Different Feeding Needs', marketLabel: 'Applications',
  markets: [
   ['Aquaculture','Fish Feed Formulations','Consider BSFL meal when evaluating alternative protein sources for aquafeed.','img/envirobug/aquaculture.jpg','Catfish swimming underwater','fish'],
   ['Pet Food','Companion Animal Nutrition','Discuss species, life stage and processing requirements with your nutritionist.','img/envirobug/feeding-pets.jpg','Puppies eating from bowls','paw'],
   ['Poultry','Balanced Poultry Feed','Explore insect-derived amino acids within a complete poultry feeding program.','img/envirobug/poultry.jpg','Chickens walking outdoors','poultry'],
   ['Young Animals','Growth Stage Formulations','Assess digestible nutrients and energy alongside the other ingredients in the diet.','img/envirobug/piglets.jpg','Young piglets outdoors','growth']
  ],
  processLabel: 'Ingredient Journey', processTitle: 'From Larvae<br>To Fine Protein Meal',
  process: [['Larvae Rearing','Food co-products support larval growth','grain'],['Drying','Dried larvae enter processing','meal'],['Pressing','Part of the oil is separated','press'],['Fine Meal','The protein-rich fraction is ground','protein']],
  researchLabel: 'Research In Practice', researchTitle: 'Evidence For Formulation<br>Decisions',
  research: [
   ['01 / Adult Dogs','Digestibility & Acceptance','A 2021 study evaluated partially defatted BSFL meal in extruded diets for adult dogs. Acceptance and nutrient digestibility were maintained under the tested conditions.','Freel et al · 2021',sources.dogs],
   ['02 / Atlantic Salmon','Alternative Protein Blends','A 12-week trial tested EnviroMeal with fermented soy protein in juvenile Atlantic salmon diets. Growth outcomes were similar across the tested diets; the findings concern the blend and trial conditions.','Fredrickson et al · 2023',sources.salmon]
  ],
  researchNote: 'Study formulations are not feeding directions. Choose inclusion levels with a qualified nutritionist and current product specifications.',
  guidance: 'Formulation Guidance', guidanceTitle: 'Build A Balanced Diet',
  use: 'EnviroMeal is a feed ingredient, not a complete diet. Match its nutrient profile to the animal’s requirements and the rest of the formula.',
  use2: 'Ask CentroFarms™ about the technical sheet, batch analysis, packaging, storage and supply options for your application.',
  heroAlt: 'Close-up of finely ground EnviroMeal black soldier fly larvae meal', bannerAlt: 'Cat pictured for companion animal nutrition applications',
  related: 'Explore Other Products', closing: 'Build Your Formulation', withProduct: 'With EnviroMeal', closingText: 'Share your target species, processing needs and expected volume.',
  description: 'EnviroMeal finely ground black soldier fly larvae meal: product details, animal feed applications, research and formulation support from CentroFarms.'
 },
 vi: {
  tag: 'Dinh Dưỡng Vật Nuôi · Bột Protein Côn Trùng',
  lead: 'EnviroMeal là nguyên liệu bột mịn từ ấu trùng ruồi lính đen của EnviroFlight, được tạo ra bằng cách ép tách một phần chất béo từ ấu trùng sấy khô.',
  sub: 'Khám phá nguồn protein côn trùng cho thức ăn phối trộn, cùng hồ sơ sản phẩm và hỗ trợ ứng dụng từ CentroFarms™.',
  explore: 'Khám Phá EnviroMeal', contact: 'Yêu Cầu Thông Tin Sản Phẩm', overviewLabel: 'Tổng Quan Sản Phẩm',
  overviewTitle: 'Protein Côn Trùng<br>Cho Công Thức Của Bạn',
  overview: 'Theo EnviroFlight, EnviroMeal giàu protein, cung cấp axit amin, có tính ngon miệng và khả năng tiêu hóa cao. Dạng bột mịn khác với ấu trùng nguyên con EnviroBug và phần dầu tách riêng EnviroOil.',
  overview2: 'Đánh giá nguyên liệu trong công thức cân đối, dựa trên bảng thông số hiện hành về protein, chất béo còn lại, độ ẩm và thành phần axit amin.',
  traits: [['Protein','Axit Amin'],['Bột Mịn','Dạng Nghiền'],['Ép Tách','Giảm Một Phần Béo']],
  note: 'Xác nhận thông số hiện hành và mức bổ sung phù hợp với loài vật nuôi trước khi xây dựng công thức.',
  marketTitle: 'Một Nguyên Liệu<br>Nhiều Nhu Cầu Dinh Dưỡng', marketLabel: 'Ứng Dụng',
  markets: [
   ['Thủy Sản','Công Thức Thức Ăn Cho Cá','Cân nhắc bột ấu trùng khi đánh giá nguồn protein thay thế trong thức ăn thủy sản.','img/envirobug/aquaculture.jpg','Cá bơi dưới nước','fish'],
   ['Thú Cưng','Dinh Dưỡng Vật Nuôi Đồng Hành','Trao đổi với chuyên gia về loài, giai đoạn sống và yêu cầu chế biến.','img/envirobug/feeding-pets.jpg','Đàn chó con ăn từ bát thức ăn','paw'],
   ['Gia Cầm','Thức Ăn Gia Cầm Cân Đối','Khám phá nguồn axit amin từ côn trùng trong chương trình dinh dưỡng gia cầm hoàn chỉnh.','img/envirobug/poultry.jpg','Gà đi lại ngoài trời','poultry'],
   ['Vật Nuôi Non','Công Thức Cho Tăng Trưởng','Đánh giá dưỡng chất tiêu hóa và năng lượng cùng các nguyên liệu khác trong khẩu phần.','img/envirobug/piglets.jpg','Đàn heo con ngoài trời','growth']
  ],
  processLabel: 'Hành Trình Nguyên Liệu', processTitle: 'Từ Ấu Trùng<br>Đến Bột Protein Mịn',
  process: [['Nuôi Ấu Trùng','Tận dụng phụ phẩm thực phẩm cho tăng trưởng','grain'],['Sấy Khô','Chuẩn bị ấu trùng cho chế biến','meal'],['Ép Tách','Tách một phần dầu khỏi ấu trùng','press'],['Nghiền Mịn','Tạo phần bột giàu protein','protein']],
  researchLabel: 'Nghiên Cứu Ứng Dụng', researchTitle: 'Cơ Sở Cho Quyết Định Phối Trộn',
  research: [
   ['01 / Chó Trưởng Thành','Tiêu Hóa & Tiếp Nhận','Nghiên cứu năm 2021 đánh giá bột ấu trùng giảm béo một phần trong khẩu phần ép đùn cho chó trưởng thành. Mức tiếp nhận và khả năng tiêu hóa được duy trì trong điều kiện thử nghiệm.','Freel và cộng sự · 2021',sources.dogs],
   ['02 / Cá Hồi Đại Tây Dương','Kết Hợp Nguồn Protein','Thử nghiệm 12 tuần sử dụng EnviroMeal cùng protein đậu nành lên men cho cá hồi non. Tăng trưởng tương tự giữa các khẩu phần thử nghiệm; kết quả áp dụng cho hỗn hợp và điều kiện nghiên cứu.','Fredrickson và cộng sự · 2023',sources.salmon]
  ],
  researchNote: 'Công thức nghiên cứu không phải hướng dẫn cho ăn. Xác định mức bổ sung cùng chuyên gia dinh dưỡng và bảng thông số sản phẩm hiện hành.',
  guidance: 'Hướng Dẫn Phối Trộn', guidanceTitle: 'Xây Dựng Khẩu Phần Cân Đối',
  use: 'EnviroMeal là nguyên liệu, không phải thức ăn hoàn chỉnh. Cân đối thành phần dinh dưỡng theo nhu cầu vật nuôi và các nguyên liệu còn lại trong công thức.',
  use2: 'Liên hệ CentroFarms™ để nhận thông số kỹ thuật, phiếu phân tích lô hàng và thông tin về đóng gói, bảo quản, cung ứng.',
  heroAlt: 'Cận cảnh bột ấu trùng ruồi lính đen EnviroMeal nghiền mịn', bannerAlt: 'Mèo minh họa ứng dụng dinh dưỡng cho thú cưng',
  related: 'Khám Phá Các Sản Phẩm Khác', closing: 'Xây Dựng Công Thức', withProduct: 'Cùng EnviroMeal', closingText: 'Chia sẻ loài vật nuôi, nhu cầu chế biến và sản lượng dự kiến của bạn.',
  description: 'EnviroMeal: bột ấu trùng ruồi lính đen nghiền mịn, ứng dụng thức ăn chăn nuôi, nghiên cứu và hỗ trợ phối trộn từ CentroFarms.'
 }
};

for (const lang of ['en','vi']) {
 const c = content[lang], prefix = lang === 'vi' ? 'vi/' : '';
 const template = fs.readFileSync(prefix+'agrisolutions/enviroflight/envirobug/index.html','utf8');
 const contact = prefix+'contact/';
 const main = require('./enviromeal-layout.cjs')(c, prefix, lang, icon);
 // Update only the shell's language links before inserting the new product content.
 let html = template.replaceAll('envirobug/','enviromeal/').replace('data-page="envirobug"','data-page="enviromeal"');
 html = html.replace(/<main>[\s\S]*?<\/main>/,main).replace(/<title>.*?<\/title>/,`<title>CentroFarms™ | EnviroMeal${lang==='vi'?' | VI':''}</title>`).replace(/<meta name="description" content="[^"]*">/,`<meta name="description" content="${c.description}">`).replace('<link rel="stylesheet" href="assets/envirobug.css">','').replace('</head>','<link rel="stylesheet" href="assets/enviromeal.css"></head>');
 const dest = prefix+'agrisolutions/enviroflight/enviromeal/index.html';
 fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.writeFileSync(dest,html);
}

// Keep existing product cards connected, without changing the destination of other products.
for(const prefix of ['', 'vi/']) {
 for(const file of ['agrisolutions/index.html','agrisolutions/enviroflight/index.html','agrisolutions/enviroflight/enviropro/index.html','agrisolutions/enviroflight/envirobug/index.html']) {
  const target=prefix+file;
  const html=fs.readFileSync(target,'utf8');
  const updated=html.replace(/<a\b[^>]*>[\s\S]*?<\/a>/g,anchor=>anchor.includes('img/enviromeal.png')?anchor.replace(/href="[^"]*"/,`href="${prefix}agrisolutions/enviroflight/enviromeal/"`):anchor);
  if(updated!==html)fs.writeFileSync(target,updated);
 }
}
fs.writeFileSync('img/enviromeal/research-sources.json',JSON.stringify(sources,null,2));
