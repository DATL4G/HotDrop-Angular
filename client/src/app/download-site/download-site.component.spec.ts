import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadSiteComponent } from './download-site.component';

describe('DownloadSiteComponent', () => {
  let component: DownloadSiteComponent;
  let fixture: ComponentFixture<DownloadSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
