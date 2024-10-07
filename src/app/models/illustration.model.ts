export class IllustrationModel {

    constructor(
        public id: number,
        public title: string,
        public collection: string,
        public image: string,
        public price: number,
        public stock: number,
        public fav: boolean,
        public cart: boolean,
        public url: string = ''
    ){  }
}