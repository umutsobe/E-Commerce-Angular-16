import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  template: `
    <!-- <div class="d-flex justify-content-center my-4 ">
      <button routerLink="create" class="btn-lg btn btn-primary me-2 ">Create Role</button>
      <button routerLink="list" class="btn-lg btn btn-primary">List Role</button>
    </div>

    <router-outlet></router-outlet> -->
    <div class="row">
      <div class="col-4">
        <app-create-role></app-create-role>
      </div>
      <div class="col-8">
        <app-role-list></app-role-list>
      </div>
    </div>
  `,
})
export class RoleComponent {}
