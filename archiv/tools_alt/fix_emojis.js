const fs = require('fs');
const path = require('path');

const fixes = {
    "🔓": "🔓",
    "ðŸŽ": "🎁",
    "ðŸ †": "🏆",
    "ðŸ—£ï¸ ": "🗣️",
    "ðŸ” ": "🔎",
    "📖": "📖",
    "📞": "📞",
    "🎩": "🎩",
    "ðŸ•¶ï¸ ": "🕶️",
    "🧔": "🧔",
    "🧢": "🧢",
    "ðŸ•µï¸ ": "🕵️",
    "👷": "👷",
    "😠": "😠",
    "😳": "😳",
    "ðŸ§ ": "🧐",
    "👄": "👄",
    "ðŸ¥¸": "🥺",
    "ðŸ˜ ": "😐"
};

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [bad, good] of Object.entries(fixes)) {
        content = content.split(bad).join(good);
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed ${filePath}`);
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            walk(filePath);
        } else {
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.css')) {
                fixFile(filePath);
            }
        }
    });
}

walk("c:\\Users\\flaem\\Desktop\\Krimi");
