(new(function(){
  let MAX_DEPTH = 1;
  const TAB_LOAD_ARGS = {relatedToCurrent:false,inBackground:false,triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()};
  this.state = {depth:0};
  this.output = { value: "" };
  this.loadBlob = function(mimetype){
    let blob = URL.createObjectURL(new Blob([this.output.value],{type:mimetype}));
		
    gBrowser.loadOneTab(blob,TAB_LOAD_ARGS);
   setTimeout(()=>(URL.revokeObjectURL(blob)),1000);
  };
  this.formatLine = (n) => ("\n"+("| ").repeat(n)+"|_");
  this.stringifyHTML = function(node){
    let s = `<span>${node.tagName}</span><span>${(node.id ? "#" + node.id : "")}</span><span>${(node.classList[0] ? "." + node.classList[0] : "")}${(node.classList[1] ? "." + node.classList[1] : "")}</span>`;
    return s
  };
  this.stringify = function(node){
    let s = `${node.tagName}${(node.id ? "#" + node.id : "")}${(node.classList[0] ? "." + node.classList[0] : "")}${(node.classList[1] ? "." + node.classList[1] : "")}`;
    return s
  };
  this.stringifyJSON = function(node){ return `"${this.stringify(node)}"`};
  this.parseNode = function(parent,toString){
    this.state.depth++;
    for(let node of parent.children){
      this.output.value += "<br>";
      this.output.value += this.formatLine(this.state.depth) + toString(node);
      this.state.depth < MAX_DEPTH && this.parseNode(node,toString);
    }
    this.state.depth--
  };
  this.JSONencode = function(parent){
    this.state.depth++;
    for(let node of parent.children){
      this.output.value += `\n${("  ").repeat(this.state.depth)}${this.stringifyJSON(node)}:{`;
      this.state.depth < MAX_DEPTH && this.JSONencode(node);
      this.output.value += "}";
      this.output.value += node.nextElementSibling === null ? "\n" : ",";
    }
    this.state.depth--
  };
  this.createString = function(selector){
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
    this.output.value = "<html><head><style>span{color:#20B2AA}span+span{color:#CD5C5C}span+span+span{color:#808000}br{display:none}</style></head><body style='background:rgb(50,50,50)'><pre><code>";
    let node = document.querySelector(selector);
    if(!node){
      return null
    }
    this.output.value += this.stringifyHTML(node);
    this.state.depth--;
    this.parseNode(node,this.stringifyHTML);
    this.output.value += "</code></pre></body></html>";
    this.loadBlob("text/html;charset=utf-8");
  }
  this.createJSON = function(selector){
    this.output.value = "{\n";
    let node = document.querySelector(selector);
    if(!node){
      return null
    }
    this.output.value += this.stringifyJSON(node) + ":{";
    this.JSONencode(node);
    this.output.value += "}\n}";
    this.loadBlob("application/json;charset=utf-8");
  }
  this.create = function(properties){
    if(properties.depth){
      MAX_DEPTH = Math.max(Math.min(properties.depth|0,12),1); // 12 is sane maximum allowed
    }
    let output = null;
    switch(properties.type){
      case "HTML":
        this.createHTML(properties.parent);
        break;
      case "JSON":
        this.createJSON(properties.parent);
        break;
      case "STRING":
       output = this.createString(properties.parent);
        break;
      default:
        return null
    }
    return this.output.value
  }
})())
.create(
  {
    type:"HTML",
    parent:"#navigator-toolbox",
    depth:4
  }
);