import {
  Menu, MenuBar
} from '@lumino/widgets';

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