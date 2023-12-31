import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg" style="background-color: #1B6B93; height: 56px;">
      <div class="container-sm">
        <a routerLink="" role="button" class="navbar-brand cursor-pointer text-white me-1" style="width: fit-content;">Home</a>

        <!-- <div class="d-none d-md-block nav-link me-auto" *ngIf="isBrowser">
          <div class="me-auto "><a routerLink="admin" role="button" class="text-white nav-link cursor-pointer" *ngIf="authService.isAuthenticated && (this.authService.isAdmin() || this.authService.isModerator())">Admin Panel</a></div>
        </div> -->
        <a class="nav-link me-auto text-decoration-none" routerLink="admin" *ngIf="isBrowser">
          <div class="d-flex align-items-center">
            <img src="/assets/admin.png" style="width: 32px;" />
            <div><a class="text-white nav-link cursor-pointer" style="font-size: 13px;">Admin Panel</a></div>
          </div>
        </a>

        <div class="d-none d-lg-block mx-auto" style="width: 300px;" *ngIf="isBrowser">
          <form class="d-flex" style="height: 40px">
            <input [(ngModel)]="keyword" (keyup.enter)="search()" name="keyword" class="input form-control me-2" placeholder="Ara" />
            <div (click)="search()" type="submit" class="btn btn-warning"><img width="24px" src="/assets/glass.png" /></div>
          </form>
        </div>

        <div class="d-flex" [style.margin-left.px]="marginLeftLoginButton()" *ngIf="isBrowser">
          <a (click)="routeLogin()" routerLink="/login" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-warning">Login</button></a>
        </div>

        <div *ngIf="authService.isAuthenticated && isBrowser" class="dropdown me-2">
          <div role="button" class="item btn dropdown-toggle text-white py-2" style="background-color: #322653;" data-bs-toggle="dropdown">Account</div>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
            <a routerLink="account" role="button" class="dropdown-item text-decoration-none">Account Details</a>

            <a routerLink="account/orders" role="button" class="dropdown-item text-decoration-none">Orders</a>
            <a routerLink="/basket" role="button" class="dropdown-item text-decoration-none">Basket<fa-icon class="fs-5 ms-2" [icon]="faShoppingCart"></fa-icon></a>

            <li><hr class="dropdown-divider" /></li>
            <a routerLink="admin" role="button" class="dropdown-item text-decoration-none">Admin Panel</a>

            <li (click)="toggleTheme()" role="button" class="dropdown-item">{{ toggleThemeString }} <fa-icon role="button" class="fs-5 m-0 ms-2 align-content-center" [icon]="faCircleHalfStroke"></fa-icon></li>
            <li><a role="button" class="dropdown-item text-danger" (click)="signOut()">Logout</a></li>
          </ul>
        </div>

        <a *ngIf="authService.isAuthenticated && isBrowser" routerLink="/basket" class="d-none d-sm-block text-decoration-none">
          <div role="button" class="m-0 p-0 p-1 btn btn-warning d-flex justify-content-center align-items-center" style="height: 40px; width: 98px; background-color: #fbc524;">
            <fa-icon class="m-0 p-0 fs-5 me-1" [icon]="faShoppingCart"></fa-icon>
            <a class="m-0 p-0 nav-link text-dark me-1">Cart</a>
          </div>
        </a>
      </div>
    </nav>
  `,
  styles: [
    `
      .input {
        box-shadow: none;
      }
      .item {
        box-shadow: none;
        border: 0px;
      }
    `,
  ],
})
export class HeaderComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faCircleHalfStroke = faCircleHalfStroke;
  toggleThemeString = 'Theme';
  isBrowser;

  constructor(public authService: AuthService, private router: Router, private accountService: AccountService, @Inject(PLATFORM_ID) private platformId: Object) {}

  async ngOnInit() {
    this.authService.identityCheck();
    this.isBrowser = isPlatformBrowser(this.platformId); //search prerender iyi çalışmıyor

    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'dark');
        this.toggleThemeString = 'Light Theme';
      } else {
        if (localStorage.getItem('theme') == 'light') {
          document.body.setAttribute('data-bs-theme', 'light');
          this.toggleThemeString = 'Dark Theme';
        } else {
          document.body.setAttribute('data-bs-theme', 'dark');
          this.toggleThemeString = 'Light Theme';
        }
      }
    }
  }

  keyword: string;
  search() {
    if (this.keyword.length < 1) return;

    const searchValue: string = this.keyword;
    const resultString: string = searchValue.replace('?', '');

    this.router.navigate(['/search'], { queryParams: { keyword: resultString } });
  }
  signOut() {
    localStorage.removeItem('accessToken');
    this.router.navigate(['']).then(() => {
      if (typeof window !== 'undefined') window.location.reload();
    });
  }

  toggleTheme() {
    if (localStorage.getItem('theme') == 'dark') {
      document.body.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');

      this.toggleThemeString = 'Dark Theme';
    } else {
      document.body.setAttribute('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');

      this.toggleThemeString = 'Light Theme';
    }
  }

  async routeLogin() {
    this.authService.identityCheck();
    this.authService.isAuthenticated;
    this.router.navigateByUrl('/login');
  }

  marginLeftLoginButton(): number {
    if (window.innerWidth < 600) return 0;
    else if (window.innerWidth > 600 && _isAuthenticated) return 90; //account button came
    else return 190;
  }
}
