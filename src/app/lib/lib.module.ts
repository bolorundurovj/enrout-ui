import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LogoComponent} from "@lib/components/logo/logo.component";
import {RouterModule} from "@angular/router";
import {LayoutHorizontalComponent} from "@lib/components/layouts/layout-horizontal/layout-horizontal.component";
import {SpinnerComponent} from './components/spinner/spinner.component';
import {FlowbiteModule} from "flowbite-angular";


@NgModule({
  declarations: [LogoComponent, LayoutHorizontalComponent, SpinnerComponent],
  imports: [
    CommonModule,
    RouterModule,
    FlowbiteModule
  ],
  exports: [LogoComponent, LayoutHorizontalComponent, SpinnerComponent],
})
export class LibModule {
}
