// ==UserScript==
// @long-description
// @description    Snapshot UI window document
/* This script is supposed to be imported to Firefox browser window context like this (this assumes it is stored in a /modules/ directory inside scripts directory):

const { snapshot } =  ChromeUtils.importESModule("chrome://userscripts/content/modules/snapshot-ui.sys.mjs");

You can then run it like this:
snapshot(window).then(console.log)

That should create a new file to resources/ directory and log number of written bytes (probably order of 100kB)*/
// ==/UserScript==

function getAttrs(e){
  let s = [e.localName];
  if(e.id){
    s[0] += `#${e.id}`;
  }
  if(e.classList.length){
    e.classList.forEach(cls => {s[0] += `.${cls}`});
  }
  for(let i = 0; i<e.attributes.length; i++){
    let a = e.attributes[i];
    if(a.name === "id" || a.name === "class" || a.name === "style" || a.name === "src" || a.name === "data-l10n-id" || a.name === "image" || a.name.startsWith("on")){
      continue
    }
    s.push(`${a.name}="${a.value}"`)
  }
  return s
}

function encodeElem(e,depth){
  if(depth <= 0){
    return "{...}"
  }
  let shadowRoot = e.shadowRoot;
  let o = e.children.length || shadowRoot
      ? { }
      : e.textContent;
  for(let i of e.children){
    o[getAttrs(i).join(" ")] = encodeElem(i,depth - 1);
  }
  if(shadowRoot){
    o["#shadowRoot"] = `(${shadowRoot.mode})`
  }
  return o
}

function snapshotNode(node,depth){
  return {[getAttrs(node).join(" ")] : encodeElem(node,depth)};
}
function snapshotUI(win,options = {}){
  const MAX_DEPTH = options.depth || 12;
  let node = options.selector
    ? win.document.querySelector(options.selector)
    : win.document.documentElement;
  if(!node){
    throw new Error("no node to snapshot")
  }
  return snapshotNode(node,MAX_DEPTH);
}
export function snapshot(window,depth = 16){
  const { FileSystem } = ChromeUtils.import("chrome://userchromejs/content/fs.jsm");
  let blob = snapshotUI(window,{depth: depth});
  const fileName = `${window._ucUtils.brandName.replace(" ","_")}-${(new Date()).toISOString().slice(0,19).replaceAll(":","")}.json`;
  return FileSystem.writeFile(fileName,JSON.stringify(blob))
}
