import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 
'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8';
const EXCEL_EXT = '.xlsx';

@Injectable(  {
  providedIn: 'root'
})
export class ExportarService {

  constructor() { }

  exportToExcel(json?:any[] , json2?:any[], json3?:any[], json4?:any[], json5?:any[],  excelFileName?:string) :void{
    // 
    const worksheet  : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const worksheet2 : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json2);
    const worksheet3 : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json3);
    const worksheet4 : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json4);
    const worksheet5 : XLSX.WorkSheet = XLSX.utils.json_to_sheet(json5);


    const workbook : XLSX.WorkBook = { 
    Sheets     : {'Sauce': worksheet, 'Almahsa': worksheet2, 'Archivo':worksheet3, 'ArchivoSps':worksheet4, 'Frio':worksheet5},
    SheetNames : ['Sauce', 'Almahsa', 'Archivo', 'ArchivoSps', 'Frio'],
    Props  : {
      
    }
   }
   
   
   const excelBuffer: any = XLSX.write(workbook, {bookType:'xlsx', type:'array'})
   // Call Method buffer and fileName
   this.saveAsExcel(excelBuffer, excelFileName);
}

private saveAsExcel(buffer:any, fileName:string ): void{
	const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});	
	FileSaver.saveAs(data,fileName + new Date().toLocaleTimeString() + EXCEL_EXT);

}

}
