import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WrapComponent } from 'src/utils/test-helpers';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { OtherComponentComponent } from './other-component/other-component.component';
const wrapper = WrapComponent(AppComponent);
describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        wrapper,
        //removing below line will make the test work, no idea why.
        MockComponent(OtherComponentComponent),
      ],
    }).compileComponents();
  });

  //this wouldn't work with ng-mocks, somehow, AppComponent usage within the wrapper is replaced with a mock (only when we mock other components, more info at line 16).
  it('should find test header within the wrapper component', () => {
    const fixture = TestBed.createComponent(wrapper);
    let el = fixture.debugElement.query(By.css('#test-header'));
    expect(el).toBeTruthy();
  });

  it(`should find test header within the actual component`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    let el = fixture.debugElement.query(By.css('#test-header'));
    expect(el).toBeTruthy();
  });
});
