import { PieceModel } from "./piece.model";

export class WorkModel {

    constructor(
        public id: number = 0,
        public title: string = '',
        public statement: string = '',
        public description: string = '',
        public image: string = '',
        public pieces: PieceModel[] = [],
        public url: string = ''
    ){}
}