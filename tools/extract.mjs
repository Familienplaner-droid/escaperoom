import * as acorn from '/tmp/node_modules/acorn/dist/acorn.mjs';
import * as walk from '/tmp/node_modules/acorn-walk/dist/walk.mjs';
import fs from 'fs';
const src=fs.readFileSync(process.argv[2],'utf8');
const ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'module'});
const out=new Map(), frag=[];
const de=s=>/[a-zäöüß]{3,}/.test(s.replace(/<[^>]*>/g,'').replace(/&[a-z]+;/g,'')) && !/^\s*[<{]?\s*(svg|path|circle|rect|g |defs|image|clipPath|filter|linearGradient|radialGradient)/.test(s) && /[ ]/.test(s.replace(/<[^>]*>/g,' ').trim()) || /[äöüÄÖÜß]/.test(s);
walk.full(ast,n=>{
 if(n.type==='Literal'&&typeof n.value==='string'&&de(n.value)) out.set(n.value,(out.get(n.value)||0)+1);
 if(n.type==='TemplateLiteral'){ for(const q of n.quasis){ const v=q.value.cooked; if(v&&de(v)&&!/^[\s\S]*(fill=|stroke=|viewBox|transform=|style=)[\s\S]*$/.test(v)) (n.expressions.length?frag:[]).push(v), n.expressions.length||out.set(v,1); } }
});
const keys=[...out.keys()];
fs.writeFileSync(process.argv[3],JSON.stringify(keys,null,1));
fs.writeFileSync(process.argv[3]+'.frag.json',JSON.stringify([...new Set(frag)],null,1));
console.log(keys.length,'strings', keys.join(' ').split(/\s+/).length,'words; frags',new Set(frag).size);
