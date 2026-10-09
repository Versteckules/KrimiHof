const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/stations.json');
let content = fs.readFileSync(filePath, 'utf8');

// UTF-8 double encoding fixes
const fixes = {
  'ä': 'ä',
  'ü': 'ü',
  'ö': 'ö',
  'ß': 'ß',
  'Ä': 'Ä',
  'Ü': 'Ü',
  'Ö': 'Ö',
  'é': 'é',
  'ó': 'ó',
  '°': '°'
};

for (const [bad, good] of Object.entries(fixes)) {
  content = content.split(bad).join(good);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed encodings in stations.json');
