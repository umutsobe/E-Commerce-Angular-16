import { Injectable } from '@angular/core';
import { HttpClientService } from '../common/http-client.service';
import { Observable, firstValueFrom, map } from 'rxjs';
import { List_Basket_Item } from 'src/app/contracts/basket/list_basket_item';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { Update_Basket_Item } from 'src/app/contracts/basket/update_basket_item';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Error_DTO } from 'src/app/contracts/error_dto';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  constructor(private httpClientService: HttpClientService, private jwtHelper: JwtHelperService) {}

  getBasketId(): string {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const decodedToken = this.jwtHelper.decodeToken(token);

      const basketId: string = decodedToken.basketId;
      return basketId;
    }
    return '';
  }

  async get(): Promise<List_Basket_Item[]> {
    const BasketId = this.getBasketId();

    const observable: Observable<List_Basket_Item[]> = this.httpClientService.get(
      {
        controller: 'baskets',
      },
      BasketId
    );

    return await firstValueFrom(observable);
  }

  async add(basketItem: Create_Basket_Item): Promise<Error_DTO> {
    const observable: Observable<Error_DTO | any> = this.httpClientService.post(
      {
        controller: 'baskets',
      },
      basketItem
    );

    return await firstValueFrom(observable);
  }

  async updateQuantity(basketItem: Update_Basket_Item): Promise<Error_DTO> {
    const observable: Observable<Error_DTO | any> = this.httpClientService.put(
      {
        controller: 'baskets',
      },
      basketItem
    );

    return await firstValueFrom(observable);
  }

  async remove(basketItemId: string) {
    const observable: Observable<any> = this.httpClientService.delete(
      {
        controller: 'baskets',
      },
      basketItemId
    );

    await firstValueFrom(observable);
  }
}
