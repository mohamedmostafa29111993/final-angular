import { Pipe, PipeTransform } from '@angular/core';
import { MppingHilightDto } from '@shared/custom-dtos/mapping-hilight-Dto';
import { FormStructureColumnDto } from '@shared/service-proxies/service-proxies';

@Pipe({
  name: 'filteration'
})
export class FilterationPipe implements PipeTransform {

  transform(column: FormStructureColumnDto, item:MppingHilightDto [], kpiId: number): boolean{
    let res;
    if(column){
      if(item){
        for(let i of item){

          if(i.BindingSource === column.bindSource && i.rowId === kpiId){
            res =  true;
            break;
          } else{
             res =  false;
          }
        }
      }
    } else {
      res =  false
    }
    return res;
  }

}
