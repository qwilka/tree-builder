// import 'jquery.fancytree/dist/skin-awesome/ui.fancytree.css'
// import $ from 'jquery';  
// import 'jquery.fancytree';
// import 'jquery.fancytree/dist/modules/jquery.fancytree.glyph';
// import 'jquery-contextmenu/dist/jquery.contextMenu.css';  
// import 'jquery-contextmenu';

import { commands } from './commands';



export const attachDatatree = (treeData=null) => {
  $("#datatree").fancytree({
    extensions: ["glyph"],
    glyph: {
      preset: "awesome5",
      map: {}
    },
    types: {
      "gis-widget": {icon: "fas fa-globe", iconTooltip: "GIS widget..."},
    },
    icon: icon_datatree,
    iconTooltip: iconTooltip_datatree,
    select: select_datatree,
    lazyLoad: lazyLoad_datatree,
    init: init_datatree,
    source: treeData
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
    console.log("root child", ii, node.title);
    switch(node.type) {
      case "gis-widget":
        commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
    }
  }
}

const build_contextMenu = ($trigger, evt) => {
  let node = $.ui.fancytree.getNode($trigger);
  switch(node.type) {
    case "gis-widget":
      return {
        items: {
          "create-gis": {
            name: "Create GIS",
            icon: "fas fa-globe",
            callback: (key, opt) => {
              let id_number = node.getIndex();
              //createGisWidget(id_number, "testing GIS");
              commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
            }
          },
          "console-message": {
            name: "msg to console",
            icon: "fas fa-globe",
            callback: (key, opt) => {
              commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
            }
          },
        }
      };
      break;
    default:
      return {
        items: {
          "create-gis": {
            name: "Create GIS",
            icon: "fas fa-globe",
            callback: (key, opt) => {
              let id_number = node.getIndex();
              //createGisWidget(id_number, "testing GIS");
              commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
            }
          },
          "console-message": {
            name: "msg to console",
            icon: "fas fa-globe",
            callback: (key, opt) => {
              commands.execute('message-to-console', {msg: "gis-widget: testing context menu"});
            }
          },
        }
      };
  }
}