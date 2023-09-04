import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { List_Product } from 'src/app/contracts//product/list_product';
import { ProductService } from 'src/app/services/models/product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { formatDate } from '@angular/common';
import { IdExchangeService } from 'src/app/services/data-exchange/id-exchange.service';
import { List_Product_Image } from 'src/app/contracts/product/list_product_image';
import { List_Category } from 'src/app/contracts/category/list_category';
import { MatSelectionList } from '@angular/material/list';
import { CategoryService } from 'src/app/services/models/category.service';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProductFilter } from 'src/app/contracts/product/filter_product';
import { Subject, debounceTime } from 'rxjs';
import { List_Product_Admin } from 'src/app/contracts/product/list_Product_Admin';

declare var $: any;
@Component({
  selector: 'app-list',
  template: `
    <h1 class="mt-2 text-center" id="title">Products</h1>
    <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
      <!-- filters -->
      <div class="d-flex mb-2 align-items-center">
        <form class="d-flex" style="height: 40px">
          <input [(ngModel)]="productFilter.keyword" (input)="onInputKeyup()" name="onemsiz" class="form-control me-2 " placeholder="İsme Göre Ara" />
          <!-- <button type="button" class="btn btn-warning"><fa-icon class="fs-5 me-1" [icon]="faMagnifyingGlass"></fa-icon></button> -->
        </form>
        <div class="dropdown ps-4" style="width: fit-content;">
          <div class="dropdown-toggle user-select-none" type="button" data-bs-toggle="dropdown" style="padding: 8px; border: 1px solid gray;border-radius: 5px; ">Sıralama</div>
          <ul class="dropdown-menu dropstart">
            <li (click)="sortLowPrice()" type="button" class="dropdown-item">En düşük fiyat</li>
            <li (click)="sortHighPrice()" type="button" class="dropdown-item">En yüksek fiyat</li>
            <li (click)="sortSaleNumber()" type="button" class="dropdown-item">Çok satanlar</li>
            <li type="button" class="dropdown-item">Yeni eklenenler</li>
          </ul>
        </div>
        <select *ngIf="categories" class="ms-2 form-select" (change)="categorySelected($event)" style="width: fit-content; border: 1px solid gray">
          <option selected>Kategori</option>
          <option type="button" *ngFor="let category of categories.categories">{{ category.name }}</option>
        </select>
      </div>
      <!-- tablo -->
      <table class="table table-striped table-responsive">
        <thead>
          <tr class="text-center">
            <th scope="col">Name</th>
            <th scope="col">Stock</th>
            <th scope="col">Price</th>
            <th scope="col">Total Sales Count</th>
            <th scope="col">Is Active</th>
            <th scope="col">Select Category</th>
            <th scope="col">Photo</th>
            <th scope="col">Delete</th>
            <th scope="col">Edit</th>
          </tr>
        </thead>
        <tbody *ngIf="this.allProducts">
          <tr *ngFor="let product of this.allProducts.products" class="text-center">
            <td>{{ product.name }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.totalOrderNumber }}</td>
            <td>
              <img *ngIf="product.isActive" type="button" src="/assets/completed.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <button data-bs-toggle="modal" data-bs-target="#categoryModal" (click)="openCategoryDialog(product)" class="btn btn-primary btn-sm">Category</button>
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#selectPhotoModal" (click)="openPhotoDialog(product)" src="/assets/photo.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img type="button" data-bs-toggle="modal" data-bs-target="#deleteModal" (click)="openDeleteDialog(product)" src="/assets/delete.png" width="25" style="cursor:pointer;" />
            </td>
            <td>
              <img src="/assets/edit.png" width="25" style="cursor:pointer;" />
            </td>
          </tr>
        </tbody>
        <div *ngIf="this.allProducts.products.length < 1 && !isLoading" class="my-2 alert alert-info">Product not found</div>
      </table>
      <!-- pagination -->
      <div *ngIf="!(this.allProducts.products.length < 1)" class="mt-4 pagination d-flex justify-content-center">
        <div style="margin: 6px 8px 0 0;">{{ productFilter.page + 1 + '-' + totalPageCount }}</div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="firstPage()"><<</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="previousPage()"><</a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="nextPage()">></a></div>
        <div type="button" class="m-0 page-item"><a class="m-0 page-link" (click)="lastPage()">>></a></div>
      </div>
    </div>

    <!-- ---------------------------------------------Dialogs---------------------------------------- -->

    <!-- delete dialog -->

    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Ürün Silme İşlemi</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p class="text-danger">Ürün silme işlemi geri alınamaz!!!</p>
            <p>Silinecek Ürün: {{ selectedProduct ? selectedProduct.name : '' }}</p>
            <!-- null hatası almamak için kontrol -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button (click)="delete()" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- photo dialog -->

    <div class="modal fade" id="selectPhotoModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Ürün Fotoğraf Ekleme</h1>
            <div>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
          <p class="ms-3 mt-2">Ürün Id: {{ selectedProduct ? selectedProduct.id : '' }}</p>
          <p class="ms-3 mt-2">Ürün İsmi {{ selectedProduct ? selectedProduct.name : '' }}</p>
          <div class="modal-body">
            <h4 class="text-center">Ürüne Fotoğraf Ekle</h4>
            <app-file-upload></app-file-upload>
            <!-- appfilecomponent child componenttir bu componentte göre -->
          </div>
          <div class="list-images">
            <h4 class="text-center">Ürün Fotoğrafları</h4>
            <div class="d-flex flex-wrap justify-content-center">
              <div *ngFor="let productImage of productImages" class="card m-1" style="width:11rem">
                <span class="my-1 d-flex justify-content-center">
                  Showcase
                  <input [checked]="productImage.showcase === true" class="ms-1 my-1 form-check-input" type="radio" name="img" (click)="showCase(productImage.id)" />
                </span>

                <img src="{{ productImage.path }}" class="card-img-top" />
                <div class="card-body text-center">
                  <button (click)="deleteImage(selectedProduct.id, productImage.id)" class="btn btn-danger">Delete</button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- category modal -->

    <div class="modal fade" id="categoryModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-body">
            <h2>{{ selectedProduct ? selectedProduct.name : '' }}</h2>
            <mat-selection-list #categoryComponent>
              <mat-list-option *ngFor="let category of listCategories" selected="{{ category.selected }}">
                {{ category.name }}
              </mat-list-option>
            </mat-selection-list>
          </div>
          <div class="modal-footer">
            <button (click)="assignCategories(categoryComponent)" type="button" class="btn btn-primary">Kategorileri Ata</button>
            <button (click)="closeCategoryDialog()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* mat selection list kullanan her yere yapıştır. dark theme'de sorun çıkıyor */

      *:focus {
        box-shadow: none !important;
      }

      ::ng-deep .mat-mdc-list-item-unscoped-content {
        color: #8f8979 !important;
      }
      ::ng-deep .mdc-checkbox__background {
        border-color: #8f8979 !important;
      }
      .page-item {
        user-select: none;
      }
    `,
  ],
})
export class ListComponent implements OnInit {
  constructor(private productService: ProductService, private spinner: NgxSpinnerService, private toastr: ToastrService, private idService: IdExchangeService, private categoryService: CategoryService) {
    this.inputChangeSubject.pipe(debounceTime(this.searchInputDelayTime)).subscribe(() => {
      //search inputu gecikmeli arama
      this.onSearchInputChange();
    });
  }

  allProducts: { totalProductCount: number; products: List_Product_Admin[] } = {
    totalProductCount: 0,
    products: [],
  };
  totalProductCount: number;
  totalPageCount: number;
  pageSize: number = 8; //backenddekiyle aynı olmalı
  productFilter: ProductFilter = {
    page: 0,
    keyword: '',
  };
  faMagnifyingGlass = faMagnifyingGlass;
  private inputChangeSubject = new Subject<string>();
  searchInputDelayTime: number = 300;
  isLoading: boolean = true;

  async getProducts() {
    this.spinner.show();
    const allProducts: { totalProductCount: number; products: List_Product_Admin[] } = await this.productService.getProductsByFilterAdmin(this.queryStringBuilder());
    this.allProducts = allProducts;
    this.totalProductCount = allProducts.totalProductCount;
    this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);

    this.spinner.hide();
  }
  //dialog penceresinde seçilen ürün
  selectedProduct: List_Product;

  openDeleteDialog(element: List_Product) {
    this.selectedProduct = element;
  }
  delete() {
    this.spinner.show();
    this.productService.delete(this.selectedProduct.id).subscribe(() => {
      this.spinner.hide();
      this.toastr.success('Ürün Başarıyla Silindi');
      this.getProducts();
    });
  }

  productImages: List_Product_Image[];

  openPhotoDialog(element) {
    this.selectedProduct = element;
    this.idService.setId(element.id); // file upload componentin hangi id ile işlem yapacağını söylüyor
    this.listProductPhotos(element.id);
  }

  listProductPhotos(id: string) {
    this.spinner.show('Resimler Yükleniyor');
    this.productService.readImages(id).subscribe(
      (response) => {
        this.productImages = response;
        this.spinner.hide();
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  deleteImage(productId: string, imageId: string) {
    this.spinner.show('Resim Siliniyor...');
    this.productService.deleteImage(productId, imageId).subscribe(
      () => {
        this.spinner.hide();
        this.listProductPhotos(productId);
      },
      () => {
        this.spinner.hide();
      }
    );
  }
  showCase(imageId: string) {
    this.spinner.show();

    this.productService.changeShowcaseImage(imageId, this.selectedProduct.id as string, () => {
      this.spinner.hide();
    });
  }

  formatDate(dateString: string): string {
    // date daha güzel görünür

    const date = new Date(dateString);
    if (window.innerWidth < 600) return formatDate(date, 'yyyy-MM-dd', 'en-US');
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss', 'en-US');
  }

  categories: { categories: List_Category[]; totalCategoryCount: number };
  assignedCategories: Array<string> = [];
  listCategories: { name: string; selected: boolean }[];

  async openCategoryDialog(element) {
    this.spinner.show();
    this.selectedProduct = element;
    this.assignedCategories = await this.productService.getCategoriesByProductId(element.id);

    this.categories = await this.categoryService.getCategories(0, 100);

    this.listCategories = this.categories.categories.map((r: any) => {
      return {
        name: r.name,
        selected: this.assignedCategories?.indexOf(r.name) > -1,
      };
    });
    this.spinner.hide();
  }

  assignCategories(categoryComponent: MatSelectionList) {
    this.spinner.show();
    const categories: string[] = categoryComponent.selectedOptions.selected.map((o) => o._elementRef.nativeElement.innerText);
    this.productService
      .assignCategoriesToProduct(this.selectedProduct.id, categories)
      .then(() => {
        this.toastr.success('Kategoriler Başarıyla Atandı');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  closeCategoryDialog() {
    this.listCategories = [];
  }

  sortLowPrice() {
    this.productFilter.sort = 'asc';
    this.productFilter.page = 0;
    this.getProducts();
  }
  sortHighPrice() {
    this.productFilter.sort = 'desc';
    this.productFilter.page = 0;
    this.getProducts();
  }
  sortSaleNumber() {
    this.productFilter.sort = 'sales';
    this.productFilter.page = 0;
    this.getProducts();
  }

  categorySelected(event) {
    if (event.target.value != 'Kategori') {
      this.productFilter.categoryName = event.target.value;
    } else if (event.target.value == 'Kategori') this.productFilter.categoryName = undefined;

    this.getProducts();
  }

  previousPage() {
    if (this.productFilter.page > 0) {
      this.productFilter.page--;
      this.getProducts();
    }
  }
  nextPage() {
    if (this.productFilter.page != this.totalPageCount - 1) {
      this.productFilter.page++;
      this.getProducts();
    }
  }
  firstPage() {
    if (this.productFilter.page != 0) {
      this.productFilter.page = 0;
      this.getProducts();
    }
  }
  lastPage() {
    if (this.productFilter.page != this.totalPageCount - 1) {
      this.productFilter.page = this.totalPageCount - 1;
      this.getProducts();
    }
  }

  queryStringBuilder(): string {
    let queryString: string = 'size=8';

    if (this.productFilter.categoryName) queryString += `&categoryName=${this.productFilter.categoryName}`;

    if (this.productFilter.page) queryString += `&page=${this.productFilter.page}`;

    if (this.productFilter.keyword) queryString += `&keyword=${this.productFilter.keyword}`;

    if (this.productFilter.minPrice) queryString += `&minPrice=${this.productFilter.minPrice}`;

    if (this.productFilter.maxPrice) queryString += `&maxPrice=${this.productFilter.maxPrice}`;

    if (this.productFilter.sort) queryString += `&sort=${this.productFilter.sort}`;
    return queryString;
  }

  onInputKeyup() {
    // Ancak debounceTime ile 300 ms gecikmeli olarak onSearchInputChange'e olay gönderir.
    this.inputChangeSubject.next(this.productFilter.keyword);
  }

  onSearchInputChange() {
    this.getProducts();
  }

  async ngOnInit() {
    this.categories = await this.categoryService.getCategories(0, 100);
    await this.getProducts();
    this.isLoading = false;
  }
  async pageChanged() {
    await this.getProducts();
  }
  async refresh() {
    await this.getProducts();
  }
}
