import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { OtherComponentComponent } from './other-component/other-component.component';
import { OtherDirectiveDirective } from './other-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    OtherComponentComponent,
    OtherDirectiveDirective
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
