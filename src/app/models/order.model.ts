import { ArtworkModel } from "./artwork.model";

export class PageModel {

   constructor(
       public id: number,
       public user_id: number,
       public total_amount: number,
       public artworks: ArtworkModel[],
   ){  }
}