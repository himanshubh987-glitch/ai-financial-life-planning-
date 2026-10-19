const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

console.log('--- 1. Embedding images as base64 ---');
const brandB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'img_brand.png')).toString('base64');
const profileB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'img_profile.png')).toString('base64');
const villaB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'img_villa.png')).toString('base64');
const sanctuaryB64 = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, 'img_sanctuary.png')).toString('base64');

// Replace Brand logo
html = html.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida\/AEtjO1UnNhzJRUHWDyISrKtm9UntmjL43n9YZ4FNZRQNIAKUtoQ08N9L98Kv9f2kBtqnaOI0-uu0Qx774IrX6iyqf3cp_UeGirdKf1k3ikzuZy4OQUlTgN0PqRwq6GrzKLjdYCxJT_fMrR4_QWALdYFAFBFWJCkJu64uiFkAC0-iwS0XUukPQWJ0h6qu0_GN2Pk_nik8QuI_WVdiTicP8rIznIPR5JFDJjRtfAN-kx91wCY756ouGfQSFaNJEg"/g, `src="${brandB64}"`);

// Replace Profile avatars
html = html.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuAq_h77ALzHF7qQIzjBIwFxj7UScS-y402TaFM7ltgKYI4BG_AMjUfBi_1fJpBXV6J0rYsbvroCDSVDVH7NVXIYkMz1vHPqXJasP7WQ2e1pk8IdzXZF_FD-zfEjD1aNmvQitl2wxoNZM2sDB_YFdBFCH8e7UMnRLTxmX7ZxM7FpJ6bYySaGwTRp4VeAye547kdVrZTL2FhLW6dB13iLEY70AWiSEMMfiA2wGblr7HryX09Ln1_4CEs"/g, `src="${profileB64}"`);

// Replace Villa
html = html.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuCm-ZGPA9-oF3dN-OJW2NPNpB_IjIKuupbMKPkqZ4_NCUHSbbg_BWFiZGgVHeB6-Jyrdua6CVDVU4kKAFLl3BV5qbAD3pXZNeuDOSBg1wQoQ3HSx672DfgcpQYoDfQE2M2Jh2GkKzXBtUUX8aXURZ4hem-w5ff7cEIhV3QOrN1ev4nxMavQWSPjp8GZuJqnfs6Z9SejLpp5fZM4ULyuS7EPN6JkcYXnsElvtysRolkatcKc0K08aBY"/g, `src="${villaB64}"`);

// Replace Sanctuary
html = html.replace(/src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/AB6AXuBoUGAI0_nvZvN_Fj9GrcyTSkcz7JQJloU_UU_yEeO1up-3FTKOLpTJYGqDkuWqYWtBPV2VF7vqydZuqahp8ddcPVsy4mw0tQwPThj5KvcOcZGBNO4d4Tzxrn-nRjyK47Whv7x3D0MVvahkmnyOuZNJjMxXRWrAIrhczhI0crAecghSQaLFFdYRg3Wc5yG8Enf93EwCcTx0hguB8qMq-YwYG69A9eqduhaZv0duIn3sCEzBLE6kVPA"/g, `src="${sanctuaryB64}"`);

console.log('--- 2. Linking local tailwind.js & material-symbols font ---');
// Replace Tailwind CDN script with local script
html = html.replace('<script src="https://cdn.tailwindcss.com"></script>', '<script src="tailwind.js"></script>');

// Add local font-face rule for Material Symbols in head
const localFontCss = `
<style>
@font-face {
  font-family: 'Material Symbols Outlined';
  font-style: normal;
  font-weight: 100 700;
  src: url('material-symbols.ttf') format('truetype');
}
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined' !important;
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-smoothing: antialiased;
}
</style>
`;
html = html.replace('</head>', `${localFontCss}\n</head>`);

const outPath = path.join(ROOT, 'bundled_app.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('Successfully written offline bundled HTML to:', outPath);
