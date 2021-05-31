// import {
//   Menu, MenuBar
// } from '@lumino/widgets';
const Menu = lumino_widgets.Menu;
const MenuBar = lumino_widgets.MenuBar;
const ContextMenu = lumino_widgets.ContextMenu;


import { commands } from './commands';

export const createMenus = () => {
  let appMenu = new Menu({ commands });
  appMenu.title.label = 'App';
  appMenu.addItem({ command: 'hide-show-sidePanel' });
  appMenu.addItem({ command: 'hide-show-menuBar' });

  appMenu.addItem({ command: 'message-to-console', args:{msg:"test message-to-console..", id_number:0} });


  let treeMenu = new Menu({ commands });
  treeMenu.title.label = 'Tree';
  treeMenu.addItem({ command: 'create-new-tree' });
  treeMenu.addItem({ command: 'export-tree' });
  const menuBar = new MenuBar();
  menuBar.addMenu(treeMenu);
  menuBar.addMenu(appMenu);
  return menuBar;
}


export const datatreeContextmenu = () => {
  let contextMenu = new ContextMenu({ commands });
  jsTree.prototype.context = function (evt) {
    let node = evt.target;
    if (Array.isArray(node)) {
        node.forEach(x => this.select(x));
        return this;
    }
    node = this.node(node);
    if (node) {
        this.setState(node, "selected", true);
    }
    contextMenu.open(evt);
    this.redraw();
    return this;
  };
  //document.getElementById('datatree').addEventListener('contextmenu', function (e) {
  document.addEventListener('contextmenu', function (e) {
    //contextMenu.open(e);  
    e.preventDefault();
      jsTree.instance(e.target).context(e);
      //contextMenu.open(e);
      console.log("contextmenu", e);
      if (e.target instanceof HTMLElement) {
    console.log("HTMLElement", e.target);
    let selected = jsTree.instance(e.target).getSelected()[0];
    console.log("selected node", selected);
    //selected.data.text = selected.data.text + "x";
    };
  });
  contextMenu.addItem({ command: 'message-to-console', selector: '.jstree-node', args:{msg:"CONTEXTMENU message-to-console.."} });
}