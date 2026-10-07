const fs = require('fs');
const path = require('path');

const gadgetsDir = path.join(__dirname, '..', 'js', 'ui', 'gadgets');
const files = fs.readdirSync(gadgetsDir).filter(f => f.endsWith('.js') && f !== 'gadget-manager.js');

files.forEach(file => {
  const filePath = path.join(gadgetsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  let updated = false;

  // 1. Add FX import if not present
  if (!content.includes('import * as FX')) {
    content = `import * as FX from '../../fx.js';\n` + content;
    updated = true;
  }

  // 2. Wrap innerHTML assignments
  // Look for: overlay.innerHTML = `...`;
  // We need to carefully replace the start and end of the template literal.
  const regex = /overlay\.innerHTML\s*=\s*`([\s\S]*?)`;/g;
  content = content.replace(regex, (match, inner) => {
    // Wenn es schon den wrapper hat, überspringen
    if (inner.includes('cl-gadget-wrapper')) return match;
    updated = true;
    return `overlay.innerHTML = \`\n<div class="cl-gadget-wrapper">\n<div class="cl-gadget-screws"></div>\n${inner}\n</div>\`;`;
  });

  // 3. Replace onSuccess() with FX.playSuccessWumms().then(() => onSuccess())
  // Be careful: onSuccess() could be onSuccess(data), but usually it's just onSuccess()
  // Look for: onSuccess()  but avoid if already replaced or inside function params
  const successRegex = /\bonSuccess\(\)/g;
  content = content.replace(successRegex, (match, offset) => {
    // Check if it's the parameter definition: function runGadget(stationId, onSuccess)
    const prevText = content.substring(Math.max(0, offset - 20), offset);
    if (prevText.includes('function') || prevText.includes('=>')) return match;
    if (prevText.includes('then(')) return match; // already wrapped?
    
    updated = true;
    return `FX.playSuccessWumms().then(() => onSuccess())`;
  });

  // 4. Inject Error Shake on alert('Falsch...') or similar
  const alertRegex = /alert\(['"](.*?)['"]\)/g;
  content = content.replace(alertRegex, (match, msg) => {
    if (msg.toLowerCase().includes('falsch') || msg.toLowerCase().includes('fehler')) {
      updated = true;
      return `FX.shakeElement(document.getElementById('gadget-fullscreen-overlay') || document.querySelector('.cl-gadget-wrapper'));\n      ${match}`;
    }
    return match;
  });

  if (updated) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
