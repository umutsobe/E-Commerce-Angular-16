import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseUrl } from 'src/app/contracts/base_url';
import { Create_Basket_Item } from 'src/app/contracts/basket/create_basket_item';
import { List_Product } from 'src/app/contracts/product/list_product';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { BasketService } from 'src/app/services/models/basket.service';
import { FileService } from 'src/app/services/models/file.service';
import { ProductService } from 'src/app/services/models/product.service';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="row mt-5" style="width: 100%;">
      <div class="col-3">
        <h1 class="text-center">Filters</h1>
      </div>
      <div class="col-9">
        <div class="d-flex flex-wrap">
          <div type="button" *ngFor="let product of products" class="card me-2 mb-2 product-card cursor-pointer" style="width: 16rem;">
            <img *ngIf="!product.productImageFiles.length" src="/assets/product.jpg" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" />
            <img *ngIf="product.productImageFiles.length" src="{{ this.baseUrl.url }}/{{ product.imagePath }}" class="card-img-top mb-0" style="width: 100%;height: 200px;object-fit: cover;" />

            <div class="card-body m-0">
              <h5 class="card-header mt-0 p-0 text-truncate" style="font-size: 18px;">{{ product.name }}</h5>
              <h5 class="text-center mt-1 text-truncate" style="font-size: 18px;">{{ product.price | currency : '₺' }}</h5>
              <button class="btn btn-primary btn-sm shadow-none w-100 mt-2" (click)="addToBasket(product)">Sepete Ekle</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nav *ngIf="isProductsByCategory" aria-label="Page navigation example">
      <ul class="mt-4 pagination pagination justify-content-center">
        <li class="page-item"><a class="page-link" [routerLink]="['/products/category', categoryName, currentPageNo - 1 <= 0 ? 1 : currentPageNo - 1]">Previous</a></li>
        <li class="page-item" *ngFor="let pageNo of pageList" routerLinkActive="active">
          <a class="page-link " class="page-link" [routerLink]="['/products/category', categoryName, pageNo]" (click)="scrollToTop()">{{ pageNo }}</a>
        </li>
        <li class="page-item"><a class="page-link" [routerLink]="['/products/category', categoryName, currentPageNo + 1 >= totalPageCount ? totalPageCount : currentPageNo + 1]">Next</a></li>
      </ul>
    </nav>

    <nav *ngIf="!isProductsByCategory" aria-label="Page navigation example">
      <ul class="mt-4 pagination pagination justify-content-center">
        <li class="page-item"><a class="page-link" [routerLink]="['/products', currentPageNo - 1 <= 0 ? 1 : currentPageNo - 1]">Previous</a></li>
        <li class="page-item" *ngFor="let pageNo of pageList" routerLinkActive="active">
          <a class="page-link " class="page-link" [routerLink]="['/products', pageNo]" (click)="scrollToTop()">{{ pageNo }}</a>
        </li>
        <li class="page-item"><a class="page-link" [routerLink]="['/products', currentPageNo + 1 >= totalPageCount ? totalPageCount : currentPageNo + 1]">Next</a></li>
      </ul>
    </nav>

    <div style="margin-bottom: 500px;"></div>
  `,
  styles: [
    `
      .page-link {
        box-shadow: none;
      }
      button {
        box-shadow: none;
      }
    `,
  ],
})
export class ProductListComponent {
  constructor(private productService: ProductService, private activatedRoute: ActivatedRoute, private fileService: FileService, private basketService: BasketService, private spinner: NgxSpinnerService, private toastr: ToastrService, private authService: AuthService, private router: Router) {}

  products: List_Product[];
  currentPageNo: number;
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 12;
  pageList: number[] = [];
  baseUrl: BaseUrl;
  isProductsByCategory: boolean;
  categoryName: string;

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  async ngOnInit() {
    this.baseUrl = await this.fileService.getBaseStorageUrl();

    this.activatedRoute.params.subscribe(async (params) => {
      this.currentPageNo = params['pageNo'] ? parseInt(params['pageNo']) : 1; // URL'de 'pageNo' parametresi belirtilmemişse, currentPageNo değişkeni 1 olarak atanır.

      let data: { totalProductCount: number; products: List_Product[] };

      if ('categoryName' in params) {
        this.categoryName = params['categoryName'];
        this.isProductsByCategory = true;

        data = await this.productService.getProductsByCategory(
          this.categoryName,
          this.currentPageNo - 1,
          this.pageSize,
          () => {},
          (errorMessage) => {}
        );
      } else {
        this.isProductsByCategory = false;

        data = await this.productService.read(
          this.currentPageNo - 1,
          this.pageSize,
          () => {},
          (errorMessage) => {}
        );
      }

      this.products = data.products;

      this.products = this.products.map<List_Product>((p) => {
        const listProduct: List_Product = {
          id: p.id,
          createdDate: p.createdDate,
          imagePath: p.productImageFiles.length ? p.productImageFiles.find((p) => p.showcase).path : '',
          name: p.name,
          price: p.price,
          stock: p.stock,
          updatedDate: p.updatedDate,
          productImageFiles: p.productImageFiles,
        };

        return listProduct;
      });

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

      this.pageList = [];

      if (this.totalPageCount >= 7) {
        if (this.currentPageNo - 3 <= 0) for (let i = 1; i <= 7; i++) this.pageList.push(i);
        else if (this.currentPageNo + 3 >= this.totalPageCount) for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++) this.pageList.push(i);
        else for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++) this.pageList.push(i);
      } else {
        for (let i = 1; i <= this.totalPageCount; i++) this.pageList.push(i);
      }
    });
  }

  async addToBasket(product: List_Product) {
    if (this.authService.isAuthenticated) {
      let _basketItem: Create_Basket_Item = new Create_Basket_Item();
      _basketItem.productId = product.id;
      _basketItem.quantity = 1;
      _basketItem.basketId = this.basketService.getBasketId();

      this.spinner.show();

      await this.basketService
        .add(_basketItem)
        .then(() => {
          this.spinner.hide();
          this.toastr.success('Ürün sepete eklenmiştir', 'Başarılı');
        })
        .finally(() => {
          this.spinner.hide();
        });
    } else {
      this.toastr.warning('Bu işlemi yapmak için giriş yapmalısınız', 'Hata');
    }
  }
}
