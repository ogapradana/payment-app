import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";

var env = environment;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  
  constructor(
    private httpClient: HttpClient,
  ) { }

  createPayment(data : any){
    return this.httpClient.post(env.host+'payment', data)
  }

  getPaymentListing(pages:string, name: string = ''){
    let endpoint = 'payment?page='+pages
    if(name != ''){
      endpoint = endpoint+'&name='+name
    }
    return this.httpClient.get(env.host+endpoint)
  }

  deletePayment(data:any = '', multiple:boolean){
    if(multiple){
      let headersOption = {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
        }),
        body: {
          ids : data
        }
      };
      return this.httpClient.delete(env.host+'payment/multiple', headersOption)
    }else{
      return this.httpClient.delete(env.host+'payment/'+data)
    }
    
  }


}
