import {
  Menu, MenuBar
} from '@lumino/widgets';

import { commands } from './commands';

export const createMenus = () => {
  let mainMenu = new Menu({ commands });
  mainMenu.title.label = 'Main';
  mainMenu.addItem({ command: 'hide-show-sidePanel' });
  mainMenu.addItem({ command: 'hide-show-menuBar' });

  mainMenu.addItem({ command: 'message-to-console', args:{msg:"test message-to-console..", id_number:0} });

  const menuBar = new MenuBar();
  menuBar.addMenu(mainMenu);
  return menuBar;
}