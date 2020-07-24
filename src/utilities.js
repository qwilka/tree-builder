import { each, find } from '@lumino/algorithm';

import {mainApp} from './index';


export const get_mainApp_widget = (id) => {
  let wids = mainApp.widgets;
  let widget = wids.find((itm) => {
    return itm.node.id == id;
  });
  return widget;
}


export function findSelectedWidget(idStartsWith="gis-") {
  let dock = get_mainPanel_widget('dock');
  let selWidIt = dock.selectedWidgets();
  console.log("function findSelectedWidget");
  let widg = find(selWidIt, itm => {
    return itm.node.id.startsWith(idStartsWith);
  });
  return widg;
}

export function findDockWidgetById(id) {
  let dock = get_mainPanel_widget('dock');
  let wids = dock.widgets();
  console.log("function findDockWidgetById id=", id);
  let widget = find(wids, itm => {
    return itm.node.id == id;
  });
  return widget;
}

// export const getWidgetByIdNumber = (widget_type, id_number) => {

// }

