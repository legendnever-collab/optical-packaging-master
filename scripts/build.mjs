import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const order=['physics/gaussian-coupling','game/missions','game/scoring','game/progress','ui/alignment-scene','ui/learning-panel','ui/controls','main'];
let code=order.map(file=>readFileSync(`src/${file}.js`,'utf8').replace(/^import .*;\s*$/gm,'').replace(/\bexport (?=(function|const|class)\b)/g,'')).join('\n');
const html=readFileSync('index.html','utf8').replace('<link rel="stylesheet" href="src/styles/main.css">',()=>`<style>${readFileSync('src/styles/main.css','utf8')}</style>`).replace('<script type="module" src="src/main.js"></script>',()=>`<script>\n(()=>{'use strict';\n${code}\n})();\n</script>`);
mkdirSync('dist',{recursive:true});writeFileSync('dist/optical-packaging-master-v0.1.html',html);console.log(`Offline HTML: ${Buffer.byteLength(html)} bytes`);
