

import { commands } from './commands';


let copy_data = null;

export const attachDatatree = (treeData=null) => {
  $('#datatree').jstree({
    'core' : {
      "check_callback" : function (operation, node, parent, position, more) {
        if(operation === "copy_node" || operation === "move_node") {
          if(parent.id === "#") {
            return false; // prevent moving a child above or below the root
          };
        };
        return true; // allow everything else
      },
      'data' : treeData
    },
    "plugins" : ["types", "contextmenu", "dnd", "search"],
    "types" : {
      "default" : {
        "icon" : "jstree-file"
      },
      "folder" : {
        "icon" : "jstree-folder"
      },
      "GIS-layer-basemap" : {
        "icon" : "fas fa-globe"
      }
    },
    "search": {"case_sensitive":false},

    "contextmenu": {
      "items": function (o, cb) { // Could be an object directly
        return {
          "create" : {
            "separator_before"	: false,
            "separator_after"	: true,
            "_disabled"			: false, //(this.check("create_node", data.reference, {}, "last")),
            "label"				: "Create",
            "action"			: function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
                let nodedata = {
                  "text": "testing new node",
                  "icon": "fas fa-asterisk"
                }
                inst.create_node(obj, nodedata, "last", function (new_node) {
                try {
                  inst.edit(new_node);
                } catch (ex) {
                  setTimeout(function () { inst.edit(new_node); },0);
                }
              });
            }
          },
          "rename" : {
            "separator_before"	: false,
            "separator_after"	: false,
            "_disabled"			: false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
            "label"				: "Rename",
            /*!
            "shortcut"			: 113,
            "shortcut_label"	: 'F2',
            "icon"				: "glyphicon glyphicon-leaf",
            */
            "action"			: function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
              inst.edit(obj);
              inst.set_icon(obj, "fas fa-car-side");
            }
          },
          "remove" : {
            "separator_before"	: false,
            "icon"				: false,
            "separator_after"	: false,
            "_disabled"			: false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
            "label"				: "Delete",
            "action"			: function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
              if(inst.is_selected(obj)) {
                inst.delete_node(inst.get_selected());
              }
              else {
                inst.delete_node(obj);
              }
            }
          },
          "ccp" : {
            "separator_before"	: true,
            "icon"				: false,
            "separator_after"	: false,
            "label"				: "Edit",
            "action"			: false,
            "submenu" : {
              "cut" : {
                "separator_before"	: false,
                "separator_after"	: false,
                "label"				: "Cut",
                "action"			: function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  if(inst.is_selected(obj)) {
                    inst.cut(inst.get_top_selected());
                  }
                  else {
                    inst.cut(obj);
                  }
                }
              },
              "copy" : {
                "separator_before"	: false,
                "icon"				: false,
                "separator_after"	: false,
                "label"				: "Copy",
                "action"			: function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  if(inst.is_selected(obj)) {
                    inst.copy(inst.get_top_selected());
                  }
                  else {
                    inst.copy(obj);
                  }
                }
              },
              "paste" : {
                "separator_before"	: false,
                "icon"				: false,
                "_disabled"			: function (data) {
                  return !$.jstree.reference(data.reference).can_paste();
                },
                "separator_after"	: false,
                "label"				: "Paste",
                "action"			: function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  inst.paste(obj);
                }
              }
            }
          }
        };
      }
    }


  });

  $("#searchbox").keyup(function () {
    var searchString = $(this).val();
    $('#datatree').jstree('search', searchString);
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
    //let source = [{title: "rootnode", key: make_nodeid(), "folder": true, myOwnAttr: "no-data-tree"}];
    //$("#datatree").fancytree("option", "source", source);
    // https://github.com/vakata/jstree/issues/2452
    $("#datatree").jstree(true).destroy();
    let newdata = {
      "text": "root of new tree",
      "state" : { "opened" : true, "selected" : true },
      "icon" : "fas fa-tree",
      "data": {} };
    attachDatatree(newdata);
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



function jstree2vntree(jstreeObj) {
  let hasChilds, vnObj = {"name":"", "data":{"_vntree":{}, "_jstree":{}}};
  for (let kk in jstreeObj){
    if(jstreeObj.hasOwnProperty(kk)){
      console.log(`${kk} : ${jstreeObj[kk]}`);
      hasChilds = false;
      switch(kk) {
        case "text":
          vnObj.name = jstreeObj.text
          break;
        case "id":
          if (jstreeObj[kk].length === 32) {
            vnObj.data._vntree["_nodeid"] = jstreeObj[kk];
          }
          //vnObj.name = ftObj.title
          break;
        case "data":
          Object.assign(vnObj.data, jstreeObj.data);
          break;
        case "children":
          hasChilds = true;
          break;
        default:
          vnObj.data._jstree[kk] = ftObj[kk]
      }

    }
 }  
 if (hasChilds) {
  vnObj.childs = [];
  let childObj;
  for (let ii=0; ii<ftObj.children.length; ii++) {
    childObj = jstree2vntree(ftObj.children[ii]);
    vnObj.childs.push(childObj);
  }
 }
 return vnObj;
}


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
