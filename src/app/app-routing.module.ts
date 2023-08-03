import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './public/components/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { ErrorComponent } from './public/components/error/error.component';
import { AuthGuard } from './guards/common/auth.guard';
import { LoginAfterGuard } from './guards/common/login-after.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      {
        path: 'customers',
        loadChildren: () => import('./admin/customers/customers.module').then((module) => module.CustomersModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
        children: [
          { path: 'create', loadChildren: () => import('./admin/products/create/create.module').then((module) => module.CreateModule), canActivate: [AuthGuard] },
          { path: 'list', loadChildren: () => import('./admin/products/list/list.module').then((module) => module.ListModule) },
        ],
      },
      {
        path: 'orders',
        loadChildren: () => import('./admin/orders/orders.module').then((module) => module.OrdersModule),
        canActivate: [AuthGuard],
      },
    ],
    canActivate: [AuthGuard],
  },

  {
    path: 'basket',
    loadChildren: () => import('./public/components/basket/basket.module').then((module) => module.BasketModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule),
  },
  { path: 'products/:pageNo', loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule) },
  { path: 'register', loadChildren: () => import('./public/components/auth/register/register.module').then((m) => m.RegisterModule), canActivate: [LoginAfterGuard] },
  { path: 'login', loadChildren: () => import('./public/components/auth/login/login.module').then((m) => m.LoginModule), canActivate: [LoginAfterGuard] },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
