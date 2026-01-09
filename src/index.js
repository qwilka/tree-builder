//import * as PouchDB from 'pouchdb';
// import {
//   BoxPanel, Widget, DockPanel
// } from '@lumino/widgets';
const Widget = lumino_widgets.Widget;
const BoxPanel = lumino_widgets.BoxPanel;
const DockPanel = lumino_widgets.DockPanel;

import './vn-styles.css';

import { createMenus, datatreeContextmenu } from './menus';
import { commands } from './commands';
import { attachDatatree } from './datatree';
import { DataEditWidget } from './data-editor';



export let mainApp;

if (false && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/vntree/sw.js')
    .then(reg => {
      console.log("Registered sw.js successfully.", reg);
    }).catch(err => {
      console.log("Failure sw.js not registered.", err);
    });   
} else {
  console.warn("No serviceWorker.");
}



class App extends BoxPanel {

  constructor(confData) {
    super({ node: document.getElementById("app"),  direction: 'left-to-right', spacing: 0 });

    this.id = 'mainpanel';
    const sidePanel = new Widget();
    sidePanel.id = "sidepanel";
    if (true) {
      let searchBox = document.createElement('input');
      searchBox.type = "text";
      searchBox.id = "searchbox";
      searchBox.placeholder = "search datatree";
      sidePanel.node.appendChild(searchBox);
    }
    let datatreeDiv = document.createElement('div');
    datatreeDiv.id = "datatree";
    sidePanel.node.appendChild(datatreeDiv);

    const dock = new DockPanel();
    dock.id = 'dock';

  

    if (true) {
      let menuBar = createMenus();
      //let menuBar = this.menuBar;
      Widget.attach(menuBar, document.body);
  
      commands.addCommand('hide-show-menuBar', {
        label: 'Hide/show menus',
        execute: () => {
          if (menuBar.isHidden) {
            menuBar.show();
          } else {
            menuBar.hide();
          }
        }
      });
      commands.addKeyBinding({
        keys: ['Accel M'],
        selector: 'body',
        command: 'hide-show-menuBar'
      });
    }

    this.addWidget(sidePanel);
    this.addWidget(dock);
    BoxPanel.setStretch(dock, 1);
    Widget.attach(this, document.body);

    attachDatatree(confData.treeData);

    document.addEventListener('keydown', (evt) => {
      commands.processKeydownEvent(evt);
    });
    datatreeContextmenu();
  }  

}

function main() {
  //let db = new PouchDB('vntree');


  fetch(conf_data_path)
  .then((resp) => {
    if (resp.status != 200) {
      console.error(`load_config failure\nurl=«${url}»\nfetch response status code: ${resp.status}`);
    };
    resp.json()
    .catch((err) => {
      console.error("load_config failure\nresp.json():", err);
    })
    .then((confData) => {
      //if (callback) callback(confData);
      console.log("confData ready", confData);
      //let app = new VnApp(confData);

      // db.info().then(function (info) {
      //   console.log("db.info()", info);
      // })

      mainApp = new App(confData);
      
    })
    // .catch((err) => {
    //   console.log("load_config failure in callback:", err);
    // });      
  })
  .catch((err) => {
    console.error("load_config failure top-level:", err);
  });

}


window.onload = () => {
    main();
}




