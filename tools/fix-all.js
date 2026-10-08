const fs = require('fs');
const path = require('path');

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
  '°': '°',
  '„': '„',
  '“': '“',
  'â€\u009d': '”', // 9D is undefined in some encodings, but let's try
  '–': '–',
  '—': '—',
  '•': '•',
  '‹': '‹',
  '›': '›',
  '🗑️': '🗑️',
  '🗑': '🗑',
  '️': '️'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const [bad, good] of Object.entries(fixes)) {
    newContent = newContent.split(bad).join(good);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Fixed:', filePath);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === '.git' || file === 'vendor' || file === 'node_modules' || file === 'assets') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.js', '.html', '.css', '.json', '.txt', '.md', '.cs', '.ps1'].includes(ext)) {
        fixFile(fullPath);
      }
    }
  }
}

walk(path.join(__dirname, '..'));
console.log('Done.');
