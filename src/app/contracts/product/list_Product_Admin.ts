import { Image } from './image';

export class List_Product_Admin {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdDate: Date;
  url: string;
  updatedDate: Date;
  productImageFiles?: Image[]; //null gelebilir
  imagePath?: string;
  //admin
  isActive: boolean;
  description: string;
  totalBasketAdded: number;
  totalOrderNumber: number;

  averageStar: number;
  totalRatingNumber: number;
}
