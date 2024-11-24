
export class AddressModel {
    constructor(
        public Street: string,
        public Details: string,
        public Zipcode: string, 
        public City: string, 
        public Province: string, 
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): AddressModel {
        return new AddressModel(
            data.Street,
            data.Details,
            data.Zipcode,
            data.City,
            data.Province,
        );
    }

    static toString(data: any): string {
        if (!data) {
            return "";
        }
        return `${data.Street}, ${data.Details}, ${data.Zipcode}, ${data.City}, ${data.Province}`;
    }
}
