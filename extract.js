const fs = require('fs');
const html = fs.readFileSync('/Users/fred/Documents/antigravity/joyful-planck/hardware_colors.html', 'utf-8');
const names = [...html.matchAll(/<div class="color-name"[^>]*>(.*?)<\/div>/g)].map(m => m[1]);
const hexes = [...html.matchAll(/<div class="color-hex">(.*?)<\/div>/g)].map(m => m[1]);
const colors = names.map((n, i) => ({ name: n, hex: hexes[i] }));
const unique = [];
const seen = new Set();
for(const c of colors){
  if(!seen.has(c.hex)){
    seen.add(c.hex);
    unique.push(c);
  }
}
fs.writeFileSync('colors.json', JSON.stringify(unique, null, 2));
