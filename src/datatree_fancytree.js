// import 'jquery.fancytree/dist/skin-awesome/ui.fancytree.css'
// import $ from 'jquery';  
// import 'jquery.fancytree';
// import 'jquery.fancytree/dist/modules/jquery.fancytree.glyph';
// import 'jquery-contextmenu/dist/jquery.contextMenu.css';  
// import 'jquery-contextmenu';

import { commands } from './commands';

// http://wwwendt.de/tech/fancytree/demo/sample-ext-edit.html#
// triggerStart: ["clickActive", "dblclick", "f2", "mac+enter", "shift+click"],
// https://wwwendt.de/tech/fancytree/doc/jsdoc/Fancytree_Widget.html
// https://github.com/swisnl/jQuery-contextMenu/tree/master/src/icons
// https://www.w3schools.com/icons/icons_reference.asp
// https://github.com/mar10/fancytree/wiki/ExtDnd5

let copy_data = null;

export const attachDatatree = (treeData=null) => {
  $("#datatree").fancytree({
    extensions: ["glyph", "edit"],
    glyph: {
      preset: "awesome5",
      map: {}
    },
    types: {
      "rootnode": {icon: "fas fa-tree", iconTooltip: "(visible) rootnode"},
      "gis-widget": {icon: "fas fa-globe", iconTooltip: "GIS widget..."},
    },
    icon: icon_datatree,
    iconTooltip: iconTooltip_datatree,
    select: select_datatree,
    lazyLoad: lazyLoad_datatree,
    init: init_datatree,
    source: treeData,
    edit: {
      triggerStart: ["dblclick", "f2", "mac+enter", "shift+click"],
      beforeEdit: function(event, data){
        // Return false to prevent edit mode
        //data.input = "xxx";
        console.log(event.type, event, data);
      },
      edit: function(event, data){
        // Editor was opened (available as data.input)
        console.log(event.type, event, data);
      },
      beforeClose: function(event, data){
        // Return false to prevent cancel/save (data.input is available)
        console.log(event.type, event, data);
        if( data.originalEvent.type === "mousedown" ) {
          // We could prevent the mouse click from generating a blur event
          // (which would then again close the editor) and return `false` to keep
          // the editor open:
//                  data.originalEvent.preventDefault();
//                  return false;
          // Or go on with closing the editor, but discard any changes:
//                  data.save = false;
        }
      },
      save: function(event, data){
        // Save data.input.val() or return false to keep editor open
        console.log("save...", this, data);
        // Simulate to start a slow ajax request...
        setTimeout(function(){
          $(data.node.span).removeClass("pending");
          // Let's pretend the server returned a slightly modified
          // title:
          //data.node.setTitle(data.node.title + "!");
          data.node.setTitle(data.node.title);
        }, 2000);
        // We return true, so ext-edit will set the current user input
        // as title
        return true;
      },
      close: function(event, data){
        // Editor was removed
        if( data.save ) {
          // Since we started an async request, mark the node as preliminary
          $(data.node.span).addClass("pending");
        }
      }
    }
  });

  $.contextMenu({
    selector: "#datatree span.fancytree-title",
    build: build_contextMenu
  });
}

const icon_datatree = (evt, data) => {
  return data.typeInfo.icon;
}

const iconTooltip_datatree = (evt, data) => {
  return data.typeInfo.iconTooltip;
}

const select_datatree = (evt, data) => {
  switch(data.node.type) {
    // case "gis-widget":
    //     let id_number = node.getIndex();
    //     let wid = document.getElementById("gis-"+id_number);
    //     if (data.node.isSelected() && wid.isHidden) {
    //       if (wid.isHidden) wid.show();
    //     } else {
    //       if (!wid.isHidden) wid.hide();
    //     }
    //   }
    default:
      console.log(`select_datatree ${data.node.title} ${data.node.type}`);
  }
}

const lazyLoad_datatree = (evt, data) => {
  let node = data.node;
  data.result = {
    url: node.data.fancytree,
    data: {mode: "children", parent: node.key},
    cache: false
  }
}

const init_datatree = (evt, data) => {
  //console.log("#datatree  init" );
  // data.tree.visit((node) => {
  //   console.log(node.title, node.key, node.getKeyPath());
  // });
  let root = data.tree.getRootNode()
  for (let ii=0; ii<root.children.length; ii++) {
    let node = root.children[ii];
    console.log("root child", ii, node.title, node.type);
    if (!node.type && !node.icon) {
      //node.title = "rootnode:" + node.title;
      node.type = "rootnode";
    }
    node.render(true);
    console.log("root child", ii, node.title, node.type);
    switch(node.type) {
      case "gis-widget":
        commands.execute('message-to-console', {msg: "init_datatree: testing context menu"});
    }
  }
}

const build_contextMenu = ($trigger, evt) => {
  let node = $.ui.fancytree.getNode($trigger);
  let _type;
  if (node.isTopLevel()) {
    _type = "rootnode";
  } else {
    _type = node.type;
  }
  switch(_type) {
    case "rootnode":
      return {
        items: {
          "add-child-node": {
            name: "Add child node",
            icon: "fas fa-level-down-alt",
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addNode({title:"NEW CHILD NODE", key: make_nodeid()}, "child");
            }
          },
          "sep1": "---------",
          "paste-child-node": {
            name: "Paste child node(s)",
            icon: "paste",
            disabled: !copy_data,
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addChildren(copy_data);
            }
          }
        },
      };
      break;
    default:
      return {
        items: {
          "move-node-up": {
            name: "Move node up",
            icon: "fas fa-long-arrow-alt-up",
            disabled: node.isFirstSibling(), 
            callback: (key, opt) => {
              let idx = node.getIndex();
              console.log(`${node.title} idx=${idx}`);
              if (!node.isFirstSibling()) {
                let tgt = node.getPrevSibling();
                node.moveTo(tgt, "before");
                console.log(`${node.title} move-node-up`);
              }
            }
          },
          "move-node-down": {
            name: "Move node down",
            icon: "fas fa-long-arrow-alt-down", 
            disabled: node.isLastSibling(),
            callback: (key, opt) => {
              let idx = node.getIndex();
              console.log(`${node.title} idx=${idx}`);
              if (!node.isLastSibling()) {
                let tgt = node.getNextSibling();
                node.moveTo(tgt, "after");
                console.log(`${node.title} move-node-down`);
              }
            }
          },
          "sep1": "---------",
          "prepend-node": {
            name: "Add node before",
            icon: "fas fa-long-arrow-alt-up", 
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addNode({title:"NEW NODE before", key: make_nodeid()}, "before");
            }
          },
          "append-node": {
            name: "Add node after",
            icon: "fas fa-long-arrow-alt-down", 
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addNode({title:"NEW NODE after", key: make_nodeid()}, "after");
            }
          },
          "add-child-node": {
            name: "Add child node",
            icon: "fas fa-level-down-alt",
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addNode({title:"NEW CHILD NODE", key: make_nodeid()}, "child");
            }
          },
          "sep2": "---------",
          "copy-node": {
            name: "Copy single node",
            icon: "far fa-copy",
            callback: (key, opt) => {
              let idx = node.getIndex();
              copy_data = node.toDict(false);
            }
          },
          "copy-branch": {
            name: "Copy branch",
            icon: "fas fa-copy",
            disabled: !node.countChildren(false),
            callback: (key, opt) => {
              let idx = node.getIndex();
              copy_data = node.toDict(true);
            }
          },
          "paste-before": {
            name: "Paste before",
            icon: "fas fa-long-arrow-alt-up",
            disabled: !copy_data,
            callback: (key, opt) => {
              let idx = node.getIndex();
              let parent = node.getParent();
              parent.addChildren(copy_data, idx);
            }
          },
          "paste-after": {
            name: "Paste after",
            icon: "fas fa-long-arrow-alt-down",
            disabled: !copy_data,
            callback: (key, opt) => {
              let idx = node.getIndex();
              let parent = node.getParent();
              if ((idx+1) === parent.children.length) {
                parent.addChildren(copy_data);
              } else {
                parent.addChildren(copy_data, idx+1);
              }
            }
          },
          "paste-child-node": {
            name: "Paste child node(s)",
            icon: "fas fa-level-down-alt",
            disabled: !copy_data,
            callback: (key, opt) => {
              let id_number = node.getIndex();
              node.addChildren(copy_data);
            }
          },
          "sep3": "---------",
          "delete-branch": {
            name: () => {
              if (!node.countChildren(false)) {
                return "Delete node";
              } else {
                return "Delete branch";
              }
            },
            icon: "far fa-trash-alt", 
            callback: (key, opt) => {
              let idx = node.getIndex();
              //node.addNode({title:"NEW NODE before"}, "before");
              node.remove();
            }
          },
          "sep4": "---------",
          "show-data": {
            name: "Show node data",
            icon: "fas fa-database",
            callback: (key, opt) => {
              let idx = node.getIndex();
              console.log(`${node.name} key=${node.key}`);
            }
          },
        }
      };
  }
}


commands.addCommand('create-new-tree', {
  label: 'New tree',
  caption: 'Create a new tree',
  execute: () => {
    console.log('Create a new tree');
    let source = [{title: "rootnode", key: make_nodeid(), "folder": true, myOwnAttr: "no-data-tree"}];
    $("#datatree").fancytree("option", "source", source);
  }
});


commands.addCommand('export-tree', {
  label: 'Export tree',
  caption: 'Export tree (JSON)',
  execute: () => {
    console.log('Export tree (JSON)');
    //let tree = $('#datatree').fancytree('getTree');
    let tree = $.ui.fancytree.getTree("#datatree");
    //let root = tree.getRootNode()
    let fname = "vntree.json"
    let ftdata = tree.toDict();  // ftdata is a "list"
    let vnObj = fancytree2vntree(ftdata[0]); // assuming there is one top-level node (the rootnode)
    console.log('ftdata = ', ftdata);
    console.log('vnObj = ', vnObj);
    const blob = new Blob([JSON.stringify(vnObj)], {type: 'application/json;charset=utf-8'})
    saveAs(blob, fname)
  }
});


function make_nodeid() {
  // https://github.com/uuidjs/uuid
  let _nodeid = uuidv4();
  _nodeid = _nodeid.replace(/-/g, "");
  return _nodeid;
}


// commands.addCommand('add-node', {
//   label: 'New tree',
//   caption: 'Create a new tree',
//   execute: args => {
//     console.log('add-node', args);
//     $("#datatree").fancytree("option", "source", source);
//   }
// });

function fancytree2vntree(ftObj) {
  let hasChilds, vnObj = {"name":"", "data":{"_vntree":{}, "_fancytree":{}}};
  for (let kk in ftObj){
    if(ftObj.hasOwnProperty(kk)){
      console.log(`${kk} : ${ftObj[kk]}`);
      hasChilds = false;
      switch(kk) {
        case "title":
          vnObj.name = ftObj.title
          break;
        case "key":
          if (ftObj[kk].length === 32) {
            vnObj.data._vntree["_nodeid"] = ftObj[kk];
          }
          vnObj.name = ftObj.title
          break;
        case "data":
          Object.assign(vnObj.data, ftObj.data);
          break;
        case "children":
          hasChilds = true;
          break;
        default:
          vnObj.data._fancytree[kk] = ftObj[kk]
      }

    }
 }  
 if (hasChilds) {
  vnObj.childs = [];
  let childObj;
  for (let ii=0; ii<ftObj.children.length; ii++) {
    childObj = fancytree2vntree(ftObj.children[ii]);
    vnObj.childs.push(childObj);
  }
 }
 return vnObj;
}
