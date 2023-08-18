import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule, ProductsModule, CustomersModule, DashboardModule, OrdersModule, RouterModule.forChild([{ path: '', component: AdminComponent }]), AuthorizeMenuModule, RoleModule],
})
export class AdminModule {}
