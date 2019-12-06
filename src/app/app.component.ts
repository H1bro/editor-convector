import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Editor';
  todoArray = [];
  todoKeyObj = [];
  editField: string;

  addStr(value) {
     // delete first and last element str
    value = value.slice(1).slice(0, -1);
    // preparation for split
    value = value.replace(new RegExp('},', 'g'), '}},');
    value = value.split('},');

    let data = [];
    for (let i = 0; i < value.length; i++) {
      let elementTextArea = value[i].replace(new RegExp('{', 'g'), '{"');
      elementTextArea = elementTextArea.replace(new RegExp(':', 'g'), '": ');
      elementTextArea = elementTextArea.replace(new RegExp(',', 'g'), ',"');
      this.todoArray.push(JSON.parse(elementTextArea));
    }
    this.todoKeyObj = Object.keys(this.todoArray[0]);
  }

  updateList(id: number, property: string, event: any) {
    const editField = event.target.textContent;
    this.todoArray[id][property] = editField;
    console.log(this.todoArray);
  }

  changeValue(id: number, property: string, event: any) {
    this.editField = event.target.textContent;
  }

  remove(id: any) {
    this.todoArray.splice(id, 1);
  }

  exportInText() {
    return this.exportInTextarea(this.todoArray);
  }

  exportInTextarea(objJson){
    let abs: string;
    let ark = [];
    for (let i = 0; i < objJson.length; i++) {
      ark.push(JSON.stringify(objJson[i]));
    }
    console.log(ark);
    abs = ark.join();
    abs = abs.replace(new RegExp('{"', 'g'), '{');
    abs = abs.replace(new RegExp('":', 'g'), ':');
    abs = abs.replace(new RegExp(',"', 'g'), ',');
    abs = '[' + abs + ']';
    return abs;
  }

  convertFromCSV(value) {
    let lines=value.split("\n");
    let result = [];
    let headers=lines[0].split(",");
    for(let i=1;i<lines.length;i++){
      let obj = {};
      let currentline=lines[i].split(",");

      for(let j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    let acv = JSON.stringify(result);
    acv = acv.replace(new RegExp('{"', 'g'), '{');
    acv = acv.replace(new RegExp('":', 'g'), ':');
    acv = acv.replace(new RegExp(',"', 'g'), ',');
    this.addStr(acv);
  }


  convertToCSV() {
    let objArray = this.todoArray;
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = Object.keys(this.todoArray[0]) + '\r\n';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
  }


  fileUploader(event: any): void {
    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    let extension = event.target.files[0].name.split('.')[1];

    if(extension == 'cvs'){
      reader.onload = () => {
        let strData = reader.result;
        console.log(strData);
        this.convertFromCSV(strData);
      }
    }else{
      reader.onload = () => {
        let strData = reader.result;
        let strRecordsArray = (<string>strData).split(/\r\n|\n/);
        this.addStr(strRecordsArray[0]);
      }
    }

  }
}
