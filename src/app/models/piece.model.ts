import { ImageModel } from "./image.model";

export class PieceModel {

    constructor(
        public id: number,
        public work_id: number,
        public title: string,
        public creation_date: Date,
        public materials: string,
        public width: number,
        public height: number,
        public depth: number,
        public images: ImageModel[],
        public price: number,
        public sold: boolean,
        public display: string
    ){  }
}