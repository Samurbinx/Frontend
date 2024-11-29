import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataFormComponent } from "../dataform/dataform.component";
import { PwdFormComponent } from "../pwdform/pwdform.component";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DataFormComponent, PwdFormComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  title = "";
  constructor(private modalService: NgbModal) { }

  open(content: any) {
    this.modalService.open(content);
  }


}
