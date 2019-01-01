/*  */
(new(function(d){
  const MAX_DEPTH = d || 1;
  this.state = {depth:0};
  this.output = { value: "" };
  this.formatLine = (n) => ("\n"+("| ").repeat(n)+"|_");
  this.stringifyHTML = function(node){
    let s = `<span style="color:#20B2AA">${node.tagName}</span><span style="color:#CD5C5C">${(node.id ? "#" + node.id : "")}</span><span style="color:#808000">${(node.classList[0] ? "." + node.classList[0] : "")}${(node.classList[1] ? "." + node.classList[1] : "")}</span>`;
    return s
  };
  this.stringify = function(node){
    let s = `${node.tagName}${(node.id ? "#" + node.id : "")}${(node.classList[0] ? "." + node.classList[0] : "")}${(node.classList[1] ? "." + node.classList[1] : "")}`;
    return s
  };
  this.parseNode = function(parent,toString){
    this.state.depth++;
    for(let node of parent.children){
      this.output.value += this.formatLine(this.state.depth) + toString(node);
      this.state.depth < MAX_DEPTH && this.parseNode(node,toString);
    }
    this.state.depth--
  };
  this.print = function(selector){
    this.output.value = "";
    let node = document.querySelector(selector);
    if(!node){
      return null
    }
    this.output.value = this.stringify(node);
    this.parseNode(node,this.stringify);
    return this.output.value;
  };
  this.createHTML = function(selector){
    this.output.value = "<html><body><pre><code>";
    let node = document.querySelector(selector);
    if(!node){
      return null
    }
    this.output.value += this.stringifyHTML(node);
    this.parseNode(node,this.stringifyHTML);
    this.output.value += "</code></pre></body></html>";
    let args = {relatedToCurrent:false,inBackground:false,triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()};
    let blob = URL.createObjectURL(new Blob([this.output.value],{type:"text/html;charset=utf-8"}));
    gBrowser.loadOneTab(blob,args);
    URL.revokeObjectURL(blob);
  }
})(6)).createHTML("#navigator-toolbox");