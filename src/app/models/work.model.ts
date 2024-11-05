import { ArtworkModel } from "./artwork.model";

export class WorkModel {
    constructor(
        public id: number = 0,
        public title: string = '',
        public statement: string = '',
        public description: string = '',
        public image: string = '',
        public artworks: ArtworkModel[] = [],
        public url: string = ''
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): WorkModel {
        return new WorkModel(
            data.id,
            data.title,
            data.statement,
            data.description,
            data.image,
            data.artworks ? data.artworks.map((a: any) => ArtworkModel.fromJson(a)) : [],
            data.url
        );
    }
}
