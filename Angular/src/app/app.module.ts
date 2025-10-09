import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DxDataGridModule, DxPopupModule, DxToolbarModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxDataGridModule,
    DxPopupModule,
    DxToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
