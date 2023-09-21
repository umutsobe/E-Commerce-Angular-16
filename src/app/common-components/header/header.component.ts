import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faCircleHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

declare let $: any;

@Component({
  selector: 'app-header',
  template: `
    <nav class="navbar navbar-expand-lg" style="background-color: #1B6B93;">
      <div class="container-sm">
        <a routerLink="" role="button" class="navbar-brand cursor-pointer text-white" style="width: fit-content;">Home</a>

        <div class="d-none d-md-block nav-link mx-auto">
          <div class="me-auto "><a routerLink="admin" role="button" class="text-white nav-link cursor-pointer" *ngIf="authService.isAuthenticated && (this.authService.isAdmin() || this.authService.isModerator())">Admin Panel</a></div>
        </div>

        <div class="d-none d-lg-block mx-auto" style="width: 400px;">
          <form class="d-flex mx-auto" style="height: 40px; padding-left: 2vw;">
            <input [(ngModel)]="keyword" name="keyword" class="input form-control me-2" placeholder="Ara" />
            <button (click)="search()" type="submit" class="btn btn-warning"><fa-icon class="fs-5 me-1" [icon]="faMagnifyingGlass"></fa-icon></button>
          </form>
        </div>

        <div class="d-flex ms-auto">
          <a routerLink="login" role="button" class="text-white me-4 nav-link cursor-pointer" *ngIf="!authService.isAuthenticated"><button class="btn btn-warning">Login</button></a>
        </div>

        <div *ngIf="authService.isAuthenticated" class="dropdown me-2 ms-auto">
          <div class="item btn dropdown-toggle text-white py-2" style="background-color: #322653;" data-bs-toggle="dropdown">Account</div>

          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-lg-start">
            <li routerLink="account" role="button" class="dropdown-item">Account Details</li>

            <li routerLink="account/orders" role="button" class="dropdown-item">Orders</li>
            <li routerLink="/basket" role="button" class="dropdown-item">Basket<fa-icon class="fs-5 ms-2" [icon]="faShoppingCart"></fa-icon></li>

            <li><hr class="dropdown-divider" /></li>
            <li *ngIf="authService.isAuthenticated && (this.authService.isAdmin() || this.authService.isModerator())" routerLink="admin" role="button" class="dropdown-item">Admin Panel</li>

            <li (click)="toggleTheme()" role="button" class="dropdown-item">{{ toggleThemeString }} <fa-icon role="button" class="fs-5 m-0 ms-2 align-content-center" [icon]="faCircleHalfStroke"></fa-icon></li>
            <li><a role="button" class="dropdown-item text-danger" (click)="signOut()">Logout</a></li>
          </ul>
        </div>

        <div *ngIf="authService.isAuthenticated" routerLink="basket" class="d-none d-sm-block">
          <div role="button" class="m-0 p-0 p-1 btn btn-warning d-flex justify-content-center align-items-center" style="height: 40px; width: 98px; background-color: #fbc524;">
            <fa-icon class="m-0 p-0 fs-5 me-1" [icon]="faShoppingCart"></fa-icon>
            <a class="m-0 p-0 nav-link text-dark me-1">Cart</a>
          </div>
        </div>
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
  faMagnifyingGlass = faMagnifyingGlass;
  toggleThemeString = 'Theme';

  constructor(public authService: AuthService, private router: Router, private accountService: AccountService) {}
  async ngOnInit() {
    this.authService.identityCheck();

    if (typeof localStorage !== 'undefined') {
      if (!localStorage.getItem('theme')) {
        localStorage.setItem('theme', 'light');
        this.toggleThemeString = 'Light Theme';
      } else {
        if (localStorage.getItem('theme') == 'light') {
          $('body').attr('data-bs-theme', 'light');
        } else {
          $('body').attr('data-bs-theme', 'dark');
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
      $('body').attr('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');

      this.toggleThemeString = 'Dark Theme';
    } else {
      $('body').attr('data-bs-theme', 'dark');
      localStorage.setItem('theme', 'dark');

      this.toggleThemeString = 'Light Theme';
    }
  }
}
