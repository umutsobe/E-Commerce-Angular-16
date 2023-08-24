import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './public/components/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';
import { ErrorComponent } from './public/components/error/error.component';
import { AuthGuard } from './guards/common/auth.guard';
import { LoginAfterGuard } from './guards/common/login-after.guard';
import { LoginBeforeGuard } from './guards/common/login-before.guard';
import { AdminPanelGuard } from './guards/admin-panel/admin-panel.guard';
import { SpecialAdminGuard } from './guards/admin-panel/special.admin.guard';
import { AccountComponent } from './public/components/account/account.component';
import { UserDetailsComponent } from './public/components/account/user-details/user-details.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminPanelGuard],
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard, AdminPanelGuard] },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard, AdminPanelGuard],
        children: [
          { path: 'create', loadChildren: () => import('./admin/products/create/create.module').then((module) => module.CreateModule), canActivate: [AuthGuard, AdminPanelGuard] },
          { path: 'list', loadChildren: () => import('./admin/products/list/list.module').then((module) => module.ListModule), canActivate: [AuthGuard, AdminPanelGuard] },
        ],
      },
      {
        path: 'orders',
        loadChildren: () => import('./admin/orders/orders.module').then((module) => module.OrdersModule),
        canActivate: [AuthGuard, AdminPanelGuard],
      },
      {
        path: 'authorize-menu',
        loadChildren: () => import('./admin/authorize-menu/authorize-menu.module').then((module) => module.AuthorizeMenuModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'roles',
        loadChildren: () => import('./admin/role/role.module').then((module) => module.RoleModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./admin/users/users.module').then((module) => module.UsersModule),
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: UserDetailsComponent, canActivate: [AuthGuard] },
      {
        path: 'orders',
        loadChildren: () => import('./public/components/account/user-orders/user-orders.module').then((module) => module.UserOrdersModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'password-change',
        loadChildren: () => import('./public/components/account/password-change/password-change.module').then((module) => module.PasswordChangeModule),
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'basket',
    loadChildren: () => import('./public/components/basket/basket.module').then((module) => module.BasketModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule),
  },
  { path: 'products/:pageNo', loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule) },

  { path: 'register', loadChildren: () => import('./public/components/auth/register/register.module').then((m) => m.RegisterModule), canActivate: [LoginAfterGuard] },

  { path: 'login', loadChildren: () => import('./public/components/auth/login/login.module').then((m) => m.LoginModule), canActivate: [LoginAfterGuard] },

  { path: 'password-reset', loadChildren: () => import('./public/components/auth/password-reset/password-reset.module').then((m) => m.PasswordResetModule), canActivate: [LoginAfterGuard] },

  { path: 'update-password/:userId/:resetToken', loadChildren: () => import('./public/components/auth/update-password/update-password.module').then((m) => m.UpdatePasswordModule), canActivate: [LoginAfterGuard] },

  { path: 'error', component: ErrorComponent },

  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
