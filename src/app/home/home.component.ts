import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../auth.service';
import { userData } from '../userData';
import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  userList!:userData[];
  userProflie!:userData;
  userForm: FormGroup;
  userForm1: FormGroup;
  closeResult = '';
  constructor( private  authService: AuthService,private modalService: NgbModal,public formBuilder: FormBuilder,) {
    this.userForm= this.formBuilder.group({
      _id:[''],
      email: [''],
      username: [''],
      phone_number: [''],
      skillset: [''],
      hobby: [''],
    });
    this.userForm1= this.formBuilder.group({
      _id:[''],
      email: [''],
      username: [''],
      phone_number: [''],
      skillset: [''],
      hobby: [''],
    })}

  ngOnInit(): void {
   
    this.getUseLSr();
  }
   getUseLSr() {
    var token =localStorage.getItem('access_token');
    var str:string= token?token:"";
    this.authService.getUser(str).subscribe((response: any)=> {
   this.userList = response.result;
  });
  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered: true,backdrop: 'static'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  close(){ this.modalService.dismissAll('Reason');} 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  validateEmail(email:string) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }
   createNewUser() {
    try{
      var data= this.userForm1.value;
      var pro=true;
       if(data.email.trim()==""){
        pro=false;
        alert("Please enter email.")
       }else if(data.username.trim()==""){
        pro=false;
        alert("Please enter username.")
       }else if(data.phone_number.trim()==""){
        pro=false;
        alert("Please enter phone.");
       }else if(data.skillset.trim()==""){
        pro=false;
        alert("Please enter skillset.")
       }else if(data.hobby.trim()==""){
        pro=false;
        alert("Please enter hobby.")
       }
       if(data.phone_number.match(/^[0-9]+$/) == null)
       {
          pro=false;
          alert("Phone number contains only digit")
       }
       if(!this.validateEmail(data.email)){
        pro=false;
        alert("Email validation fail")
       }
       if(pro==true){
        var token =localStorage.getItem('access_token');
        var str:string= token?token:"";
        this.authService.newUser(data,str)
       }
    }catch(err){
      console.log(err)
    }
  }
  async editUser(content:any,user: any) {
    try{
      this.userProflie=user;
      this.modalService.open(content, {
        centered: true,
        backdrop: 'static'
       });
       this.userForm.patchValue({
        _id:user._id,
        email: user.email,
        username: user.username,
        phone_number: user.phone_number,
        skillset: user.skillset,
        hobby: user.hobby,
       });
    }catch(err){
      console.log(err)
    }
  }
  async updateUser() {
    try{
      var data= this.userForm.value;
      var pro=true;
       if(data.email.trim()==""){
        pro=false;
        alert("Please enter email.")
       }else if(data.username.trim()==""){
        pro=false;
        alert("Please enter username.")
       }else if(data.phone_number.trim()==""){
        pro=false;
        alert("Please enter phone.");
       }else if(data.skillset.trim()==""){
        pro=false;
        alert("Please enter skillset.")
       }else if(data.hobby.trim()==""){
        pro=false;
        alert("Please enter hobby.")
       }
       if(data.phone_number.match(/^[0-9]+$/) == null)
       {
          pro=false;
          alert("Phone number contains only digit")
       }
       if(!this.validateEmail(data.email)){
        pro=false;
        alert("Email validation fail")
       }
       if(pro==true){
        var token =localStorage.getItem('access_token');
        var str:string= token?token:"";
        this.authService.updateUser(data,str)
       }
    }catch(err){
      console.log(err)
    }
  }
  async deleteUser(userData: any) {
    try{
      if(confirm("Do you confirm to delete user with email "+userData.email)){
        var token =localStorage.getItem('access_token');
        var str:string= token?token:"";
        this.authService.deleteUser(userData._id,str)
      }
    }catch(err){

    }
  }
  logout(){
    try{
      localStorage.removeItem("access_token");
      location.replace("/login");
    }catch(err){
      console.log(err);
    }
  }
}
