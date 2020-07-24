import {
  CommandRegistry
} from '@lumino/commands';

import {get_mainApp_widget} from './utilities';
// import {createGisWidget} from './gis/gis-ol-app';
// import {createDtmWidget} from './dtm/dtm-app';
//import {VnApp} from "../libs/vnleaf/src/app"


export const commands = new CommandRegistry();


commands.addCommand('message-to-console', {
  label: 'Message in console',
  caption: 'Print a message in the browser console.',
  execute: (args) => {
    if (pyodide_imported) {
      console.log(pyodide.runPython('import sys\nprint("pyodide", sys.version)'));
      //console.log(pyodide.runPython('print(1 + 2)'));
      vnargs.a =10.1;
      vnargs.b =2;
      pyodide.runPython('from js import vnargs; result = vnargs["a"] +vnargs["b"]');
      let res = pyodide.pyimport('result');
      console.log(`pyodide result=${res}`);
    }
    console.log(args.msg);
  }
}); 


commands.addCommand('hide-show-sidePanel', {
  label: 'Hide/show side-panel',
  caption: 'hide/show side-panel',
  execute: () => {
    let sidePanel = get_mainApp_widget('sidepanel');
    if (sidePanel.isHidden) {
      sidePanel.show();
    } else {
      sidePanel.hide();
    }
  }
});

commands.addKeyBinding({
  keys: ['Accel F'],
  selector: 'body',
  command: 'message-to-console',
  args: {msg: "Suppress ctrl-F"}
});

commands.addKeyBinding({
  keys: ['Accel H'],
  selector: 'body',
  command: 'hide-show-sidePanel'
});






