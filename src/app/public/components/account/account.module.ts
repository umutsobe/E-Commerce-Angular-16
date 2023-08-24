import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { RouterModule } from '@angular/router';
import { UserDetailsModule } from './user-details/user-details.module';
import { UserOrdersModule } from './user-orders/user-orders.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, RouterModule, RouterModule.forChild([{ path: '', component: AccountComponent }]), UserDetailsModule, UserOrdersModule],
})
export class AccountModule {}
