import { Injectable, Pipe } from '@angular/core';
import { mergeMap as _observableMergeMap, catchError as _observableCatch, map, tap } from 'rxjs/operators';
import { Observable, throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';

@Injectable({
  providedIn: 'root'

})
export class ActivitiesServicesService {
  ActivityBaseURL :string ="http://localhost:90/EMS.Service/";

  constructor(private http: HttpClient) {

  }

  public get(url: string, params: any = null): any {
      return this.http.get(url, { params })
  }

  public post(url: string, params: any = null): any {
 let token =this.GetTokenlogin();
  
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    //eaders_object.append("Authorization", token);
    let httpOptions = {
      headers:headers_object,
      withCredentials: true
    };

    return this.http.post(url, params, httpOptions).pipe(map(data => { data }, tap(data => { console.log(data) })));
  
  }

  public GetTokenlogin(): Observable<any> {
   let securityUrl="http://localhost:90/Security.Service/";
    let service: string = securityUrl+"api/Security/Login";
    return this.http.get(service).pipe(map(x=>x));

}

  public SaveActivity(ActivityModel:string):Observable<any>{
    
    let formData = new FormData();
    console.log(ActivityModel);
    formData.append('model', ActivityModel);
      let myService: string = this.ActivityBaseURL+"api/Activity/SaveActivity";
     return this.post(myService,formData);
  }
  // addEditTemplatesFields(model: TemplatesFieldsModel): Observable<TemplatesFieldsModel> {
  //   const url = this.fieldUrl + 'AddEditTemplatesFields';
  //   return this.http.post(url, model, this.postHttpOptions)
  //     .pipe(map(data => data as ActivityModel ));
  // }
}
