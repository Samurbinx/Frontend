import { PieceModel } from './piece.model';

export class ArtworkModel {
    constructor(
        public id: number,
        public work_id: number,
        public work_title: string,
        public title: string,
        public creation_date: number, 
        public dimensions: string, 
        public price: number | null,
        public sold: boolean,
        public display: string | null,
        public pieces: PieceModel[] = []
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): ArtworkModel {
        return new ArtworkModel(
            data.id,
            data.workID,
            data.work_title,
            data.title,
            new Date(data.creation_date).getFullYear(), 
            data.dimensions,
            data.price ?? null,
            data.sold ?? false,
            data.display ?? null,
            data.pieces ? data.pieces.map((p: any) => PieceModel.fromJson(p)) : []
        );
    }
}
