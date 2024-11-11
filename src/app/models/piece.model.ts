export class PieceModel {
    constructor(
        public id: number,
        public artwork_id: number,
        public title: string,
        public materials: string[],
        public width: number,
        public height: number,
        public depth: number | null,
        public dimensions: string | null,
        public images: string[]
    ) {}

    // Método para inicializar una instancia desde un objeto recibido
    static fromJson(data: any): PieceModel {
        return new PieceModel(
            data.id,
            data.artworkID,
            data.title,
            data.materials ?? [],
            Number(data.width),
            Number(data.height),
            data.depth ?? null,
            data.dimensions ?? null,
            data.images ? data.images : []
        );
    }
}
