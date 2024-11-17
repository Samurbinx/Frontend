import { AddressModel } from "./address.model";

export class UserModel {

    constructor(
        public email: string,        
        public pwd: string,
        public name: string,
        public surname: string,
        public nick: string,        
        public phone: string,
        public address: AddressModel | null,
    ){}

    static fromJson(data: any): UserModel {
        return new UserModel(
            data.email,
            data.pwd,
            data.name,
            data.surname,
            data.nick,
            data.phone,
            data.address ?? null,
        );
    }
}