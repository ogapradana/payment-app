import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export interface listingModel {
  created_at: string;
  id: number;
  payment_name: string;
  updated_at: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  config = {
    id: 'custom',
    itemsPerPage: 2,
    currentPage: 1,
    totalItems: 10
  };
  filter = false
  selectedItemIds: Set<number> = new Set<number>();
  submitted = false
  formControl: FormGroup;
  data : listingModel[] = []
  constructor(
    private toastr: ToastrService,
    private formBuilder : FormBuilder,
    private paymentAPI : PaymentService
  ) {
    this.formControl = this.formBuilder.group({
      payment_name: new FormControl('', Validators.required),
    })
  }

  ngOnInit(): void {
    this.fetchPaymentList()
  }

  save(){
    this.submitted = true;
    var data = this.formControl.value
    if (this.formControl.status != "INVALID") {
      this.paymentAPI.createPayment(data).subscribe((resp:any)=>{
        this.fetchPaymentList()
        this.formControl.setValue({
          payment_name : ''
        })
        this.toastr.success(resp.msg);
      })  
    }
  }

  delete(bulkDelete: boolean, id : any = ''){
    if(bulkDelete){
      this.paymentAPI.deletePayment(this.getSelectedItem, true).subscribe((resp:any)=>{
        if(resp.msg == "Data Berhasil Dihapus"){
          this.fetchPaymentList()
          this.toastr.success(resp.msg);
        }
      })
    }else if(!bulkDelete){
      this.paymentAPI.deletePayment(id, false).subscribe((resp:any)=>{
        if(resp.msg == "Data Berhasil Dihapus"){
          this.fetchPaymentList()
          this.toastr.success(resp.msg);
        }
      })
    }
  }

  onRowClick(id:any){
    if(this.selectedItemIds.has(id)) {
      this.selectedItemIds.delete(id);
    }
    else {
      this.selectedItemIds.add(id);
    }
  }

  fetchPaymentList(page:string = '1', search:any = ''){
    if(search != ''){
      search = search.target.value
    }
    this.paymentAPI.getPaymentListing(page, search).subscribe((resp:any)=>{
      this.data = resp.data.data
      this.config = {
        id : 'custom',
        itemsPerPage : resp.data.per_page,
        currentPage : resp.data.current_page,
        totalItems : resp.data.total
      }
    })
  }

  onPageChange(event:any){
    this.fetchPaymentList(event)
  }

  get getSelectedItem(){
    let rawData = this.data.filter(x => this.selectedItemIds.has(x.id));
    let filteredData = []
    for (let i = 0; i < rawData.length; i++) {
      filteredData.push(rawData[i].id) 
    }
    return filteredData
  }

  rowIsSelected(id: number) {
    return this.selectedItemIds.has(id);
  }

  get diagnostic() {
    return this.formControl.controls;
  }
}
