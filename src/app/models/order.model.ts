import { AddressModel } from "./address.model";
import { ArtworkModel } from "./artwork.model";

export class OrderModel {
   constructor(
       public id: number,
       public user_id: number,
       public total_amount: number,
       public created_at: Date,
       public status: string,
       public artworks: ArtworkModel[],
       public address: AddressModel,
   ){  }

   static fromJson(data: any): OrderModel {
    return new OrderModel(
        data.id,
        data.user_id,
        data.total_amount,
        data.created_at,
        data.status,
        data.artworks ? data.artworks.map((p: any) => ArtworkModel.fromJson(p)) : [],
        AddressModel.fromJson(data.address),
    );
}
}