import { Injectable } from '@angular/core';
import { AuthService } from '../common/auth/auth.service';
import { ListUserDetails } from 'src/app/contracts/account/ListUserDetails';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClientService } from '../common/http-client.service';
import { ListUserOrders } from 'src/app/contracts/account/ListUserOrders';
import { UpdateUserPassword } from 'src/app/contracts/account/UpdateUserPassword';
import { ListUserAddresess } from 'src/app/contracts/account/Address/ListUserAddresess';
import { CreateUserAddress } from 'src/app/contracts/account/Address/CreateUserAddress';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private http: HttpClientService, private authService: AuthService) {}

  async getUserDetails(): Promise<ListUserDetails> {
    const observable: Observable<ListUserDetails> = this.http.get(
      {
        controller: 'account',
        action: 'GetUserDetails',
      },
      this.authService.UserId
    );

    return await firstValueFrom(observable);
  }

  async updateUserEmail(userId: string, email: string): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'account',
        action: 'UpdateUserEmail',
      },
      { userId: userId, email: email }
    );

    return await firstValueFrom(observable);
  }

  async updateUserName(userId: string, name: string): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'account',
        action: 'UpdateUserName',
      },
      { userId: userId, name: name }
    );

    return await firstValueFrom(observable);
  }

  async listUserOrders(userId: string): Promise<any> {
    const observable: Observable<any> = this.http.get(
      {
        controller: 'account',
        action: 'ListUserOrders',
      },
      userId
    );

    return await firstValueFrom(observable);
  }
  async updateUserPassword(model: UpdateUserPassword): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'account',
        action: 'UpdateUserPassword',
      },
      model
    );

    return await firstValueFrom(observable);
  }

  async getUserAdresses(userId: string): Promise<ListUserAddresess[]> {
    const observable: Observable<ListUserAddresess[]> = this.http.get(
      {
        controller: 'account',
        action: 'GetUserAddresses',
      },
      userId
    );

    return await firstValueFrom(observable);
  }

  async createUserAddress(model: CreateUserAddress): Promise<any> {
    const observable: Observable<any> = this.http.post(
      {
        controller: 'account',
        action: 'AddUserAddress',
      },
      model
    );

    return await firstValueFrom(observable);
  }

  async deleteUserAddress(addressId: string): Promise<any> {
    const observable: Observable<any> = this.http.delete(
      {
        controller: 'account',
        action: 'DeleteUserAdsress',
      },
      addressId
    );

    return await firstValueFrom(observable);
  }
}
