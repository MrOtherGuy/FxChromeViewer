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
    if(a.name === "id" || a.name === "class"){
      continue
    }
    s.push(`${a.name}="${a.value}"`)
  }
  return s
}
function encodeElem(e){
  let o = e.children.length ? { } : e.textContent;
  for(let i of e.children){
    o[getAttrs(i).join(" ")] = encodeElem(i);
  }
  return o
}

function constructSpan(content){
  let span = document.createElement("span");
  if(!content){
    return span
  }
  span.textContent = content;
  if(content[0] === "."){
    span.classList.add("class-selector")
  }else if(content[0] === "#"){
    span.classList.add("id-selector")
  }
  return span
}

function init(){
  let view = document.getElementsByTagName("tree-view")[0];
  view.setLayerTransform((layer,name) => {
    if(/^template|^style|^script|^head|^keyset/.test(name)){
      layer.classList.add("deemphasized")
    }
    let fragment = new DocumentFragment();
    if(name === "#shadowRoot"){
      fragment.appendChild(constructSpan("#shadowRoot")).classList.add("shadowroot");
      return fragment
    }
    let idx = name.indexOf(" ");
    const slice = idx > 0 ? name.slice(0,idx) : name;
    
    fragment.appendChild(constructSpan(slice.match(/[a-zA-Z][\w-]*\b/)?.[0]));
    fragment.appendChild(constructSpan(slice.match(/#[a-zA-Z][\w-]*\b/)?.[0]));
    fragment.appendChild(constructSpan(slice.match(/\.[a-zA-Z][\w-]*/g)?.join("")));
    fragment.appendChild(constructSpan(name.slice(slice.length )));
    
    return fragment
  });
  let box = document.getElementById("attributecheck");
  if(!box.checked){
    view.tree.classList.add("attributes-hidden")
  }
  box.addEventListener("change",(ev)=>{
    if(ev.target.checked){
      view.tree.classList.remove("attributes-hidden")
    }else{
      view.tree.classList.add("attributes-hidden")
    }
  });
  view.src = "examples/Firefox_Nightly-2023-04-15T132251.json";
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    init();
  }
}