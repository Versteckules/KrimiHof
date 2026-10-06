const fs = require('fs');

function fixFile(filepath) {
    if (!fs.existsSync(filepath)) return;
    let text = fs.readFileSync(filepath, 'utf8');
    
    // Fix UTF-8 encoding garbled as Latin-1
    const fixes = {
        'ÃŸ': 'ß',
        'Ã¤': 'ä',
        'Ã¼': 'ü',
        'Ã¶': 'ö',
        'Ã–': 'Ö',
        'Ã„': 'Ä',
        'Ãœ': 'Ü',
        'â€ž': '„',
        'â€œ': '“',
        'â€“': '–',
        'Ã': 'í', // Catch-all? better not.
    };
    
    for (const [bad, good] of Object.entries(fixes)) {
        if (bad === 'Ã') continue; 
        text = text.split(bad).join(good);
    }
    
    // Special fix for story.json outputting weird chars in PS, might just be PS but let's check double encoding
    try {
        let doubleEncoded = fs.readFileSync(filepath, 'binary');
        // We'll just rely on the replace map. 
    } catch(e) {}
    
    fs.writeFileSync(filepath, text, 'utf8');
    console.log(`Fixed ${filepath}`);
}

fixFile('data/stations.json');
fixFile('data/story.json');
