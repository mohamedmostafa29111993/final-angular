import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StringService {
  constructor() { }
  toCamelCase(str:string):string{
    let camelCaseStr ="";
    if(str && str.length > 0){
     camelCaseStr = str[0].toLowerCase() +str.slice(1)
    }
    return camelCaseStr;
 }
}
