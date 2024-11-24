
export class AddressModel {
    constructor(
        public id: string,
        public street: string,
        public details: string,
        public zipcode: string, 
        public city: string, 
        public province: string, 
        public recipient: string, 
        public phone: string, 
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): AddressModel {
        return new AddressModel(
            data.id,
            data.street,
            data.details,
            data.zipcode,
            data.city,
            data.province,
            data.recipient,
            data.phone,
        );
    }

    static toString(data: any): string {
        if (!data) {
            return "";
        }
        return `${data.street}, ${data.details}, ${data.zipcode}, ${data.city}, ${data.province}`;
    }
}
