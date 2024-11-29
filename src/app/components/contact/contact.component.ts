import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageService } from '../../services/page.service';
import { PageModel } from '../../models/page.model';
import { MessageService } from '../../services/message.service';
import Swal from 'sweetalert2';

import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  contactPage: PageModel | undefined;

  constructor(
    private pageService: PageService,
    public _MessageService: MessageService,
    private formBuilder: FormBuilder,
  ) { }

  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    desc: new FormControl(''),
  });
  submitted = false

  ngOnInit(): void {
    this.pageService.getContactPage().subscribe(
      (page: PageModel) => {
        this.contactPage = page;
      },
      (error) => {
        console.log("Error", error);
      }
    );

    this.form = this.formBuilder.group(
      {
        name: ['', Validators.required],
        surname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email, Validators.nullValidator]],
        phone: ['', Validators.required],
        desc: ['', [Validators.required, Validators.minLength(1)]],
      }
    );
  }

  //To access form controls using -> (ex: f.username)
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true
    

    if (this.form.invalid) {
      return;
    }
    if (this.form.valid) {
      let data = {
        name: this.form.value.name,
        surname: this.form.value.surname,
        email: this.form.value.email,
        phone: this.form.value.phone,
        desc: this.form.value.desc,
      };

      this._MessageService.sendMessage(data).subscribe(() => {
        this.form.reset(); 
        Swal.fire('Formulario de contacto', 'Mensaje enviado correctamente', 'success');
        this.submitted = false

      });

    }
  }
}
