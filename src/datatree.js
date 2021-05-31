//import './libs/jstree';
//import './libs/jstree.css';

import { commands } from './commands';


let copy_data = null;









export const attachDatatree = (treeData=null) => {
  var c = 0;
  function dummy(levels, nodes) {
    var data = [], i;
    for (i = 0; i < nodes; i++) {
        c ++;
        data.push({
            'id' : levels + '_' + i,
            'text' : 'node ' + i + ' ' + (i === 1 ? 'lipsum lipsum lipsum lipsum lipsum lipsum lipsum lipsum ' : ''),
            'children' : levels > 1 ? dummy(levels - 1, nodes) : []
        });
    }
    return data;
  }  
  var instance = new jsTree({}, document.getElementById('datatree'));
  instance
      .empty()
      .create(dummy(2, 10))
      .openAll();
  console.log(c);
  let tree = instance.tree;   // 
  let root = instance.tree.root;
  //testnode = instance.select({"id":"2_0"});
  //testnode = instance.tree.find({id:"2_0"});
  let testnode = tree.find("1_2")[0];
  testnode.data.text = testnode.data.text + "_testnode";
  console.log(testnode);
  instance.create({id:"a1", text:"new test node"}, testnode);
  instance.select(testnode);
  instance.redraw();
  instance.openAll();

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
