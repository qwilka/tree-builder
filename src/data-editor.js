/*
Copyright © 2020 Qwilka Limited. All rights reserved.
Any unauthorised copying or distribution is strictly prohibited.
Author: Stephen McEntee <stephenmce@gmail.com>
*/
// import {
//     Widget
// } from '@lumino/widgets';
const Widget = lumino_widgets.Widget;


let _id_count=0;


export class DataEditWidget extends Widget {

    static createNode(id) {
        let node = document.createElement('div');
        let content = document.createElement('div');
        content.innerHTML = `<div><h2>London</h2>
        <p>London is the most populous city in the United Kingdom,
        with a metropolitan area of over 9 million inhabitants.</p>
        <hr> </div>`;
        node.appendChild(content);
        let jedit = document.createElement('div');
        jedit.setAttribute("id", "jedit-" + id);
        node.appendChild(jedit);
        // let input = document.createElement('input');
        // input.placeholder = 'Placeholder...';
        // content.appendChild(input);
        // node.appendChild(content);
        //node.setAttribute("src", "");
        //node.setAttribute("style", "width: 100%; height: 100%; margin: 0 auto;");
        //node.setAttribute("id", "map-" + id);
        //node.id = "map-" + id;
        // let content = document.createElement('div');
        // content.setAttribute("id", "gis-sidebar-" + id);
        // node.appendChild(content);
        //document.body.appendChild(content);
        return node;
      }    

      constructor(params) {
        let _id = _id_count++;
        super({ node: GisWidget.createNode(_id) });
        this.setFlag(Widget.Flag.DisallowLayout);
        //this.addClass(mapObj.class.toLowerCase());
        this.title.label = "TEST" ; //params.title;
        this.title.closable = true;
        this.title.caption = `DEDIT TEST`;
        //this.id = params.DOM_id;
        this.id = "gis-" + _id.toString();
        this.addClass('GIS');
        this.createdLayers = [];        
      }      

}