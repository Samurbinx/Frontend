
export class AddressModel {
    constructor(
        public street: string,
        public details: string,
        public zipcode: string, 
        public city: string, 
        public province: string, 
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): AddressModel {
        return new AddressModel(
            data.street,
            data.details,
            data.zipcode,
            data.city,
            data.province,
        );
    }

    static toString(data: any): string {
        if (!data) {
            return "";
        }
        return `${data.street}, ${data.details}, ${data.zipcode}, ${data.city}, ${data.province}`;
    }
}
