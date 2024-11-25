import { subscribe } from 'diagnostics_channel';
import { Component, EventEmitter, OnInit, Output, output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AddressModel } from '../../../../models/address.model';
import { AddressService } from '../../../../services/address.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../../models/user.model';
import { UserService } from '../../../../services/user.service';
import { AddresscardComponent } from './addresscard/addresscard.component';
import { AddressformComponent } from './addressform/addressform.component';
import { ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, CommonModule, AddresscardComponent, AddressformComponent],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements OnInit {
  @ViewChild('editModal', { static: false }) editModal: ElementRef | undefined;

  @Output() reload = new EventEmitter<void>(); // Evento para editar la dirección
  
  constructor(private addressService: AddressService, private authService: AuthService, private userService: UserService,private modalService: NgbModal) { }

  user: UserModel | null = null;
  userId: string | null = null;

  myaddress: AddressModel | null = null;
  alladdress: AddressModel[] | null = null;
  selectedAddress: AddressModel | null = null;

  ngOnInit(): void {
    this.loadData();
  }
  
  reloadAddresses() {
    this.loadData();
    this.reload.emit();
  }

  onEditAddress(address: any, content: any) {
    this.selectedAddress = address;
    this.modalService.open(content);
  }
 
  open(content: any) {
    this.modalService.open(content);
  }
  close() {
    this.modalService.dismissAll();
  }
  private loadData(): void {
    this.close();
    this.authService.getUserSubject().subscribe((user) => {
      this.user = user;
      const token = this.authService.getToken();

      if (token) {
        this.userId = this.authService.getUserId();
        if (this.userId) {
          this.userService.getAddress(this.userId).subscribe(
            (response) => {
              this.myaddress = AddressModel.fromJson(response);
              if (this.userId) {
                this.userService.getAllAddress(this.userId).subscribe(
                  (addresses) => {
                    this.alladdress = addresses
                      .map((address) => AddressModel.fromJson(address))
                      .filter((address) => address.id !== this.myaddress?.id); // Exclude the default address
                  },
                  (error) => {
                    console.error('Error fetching all addresses:', error);
                  }
                );
              }
            },
            (error) => {
              console.error('Error fetching default address:', error);
            }
          );


        }
      }
    });
  }
}
