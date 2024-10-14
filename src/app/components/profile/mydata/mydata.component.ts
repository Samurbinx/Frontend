import { Component, OnInit } from '@angular/core';
import { NotAuthenticatedComponent } from './not-authenticated/not-authenticated.component';
import { AuthenticatedComponent } from './authenticated/authenticated.component';
import { UserModel } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mydata',
  standalone: true,
  imports: [NotAuthenticatedComponent, AuthenticatedComponent],
  templateUrl: './mydata.component.html',
  styleUrl: './mydata.component.css'
})
export class MydataComponent implements OnInit {
  user: UserModel | null = null; // Cambiado a null

  constructor(private _userService: UserService, private formBuilder: FormBuilder  ){}
  
  form: FormGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    nick: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
  });
  submitted = false

  ngOnInit(): void {
    this.user = this._userService.getUser();
    console.log("illoo:" + this.user);

    this.form = this.formBuilder.group(
      {
        name: [this.user?.name, Validators.required],
        surname: [this.user?.surname, Validators.required],
        nick: [this.user?.nick, Validators.required],
        email: [this.user?.email, [Validators.required, Validators.email, Validators.nullValidator]],
        phone: [this.user?.phone, Validators.required],
      }
    );
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
        nick: this.form.value.nick,
        email: this.form.value.email,
        phone: this.form.value.phone,
      };
      console.log(data);
    }
  }

    //To access form controls using -> (ex: f.username)
    get f(): { [key: string]: AbstractControl } {
      return this.form.controls;
    }
}