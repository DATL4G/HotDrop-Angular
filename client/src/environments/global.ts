import {Breakpoints, BreakpointObserver} from "@angular/cdk/layout";
import {map, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";

export const dialogWidth: string = '300px';
export const snackbarDuration: number = 3000;

export const actionBarHeightDesktop: string = '64px';
export const actionBarHeightMobile: string = '56px';
export const sideMarginMobile: string = '16px';
export const sideMarginDesktop: string = '32px';

export const settingsOptions: Array<String> = [
  'Connectivity',
  'Patreon'
];

export const dependencies: Array<String> = [
  'Angular',
  'FontAwesome',
  'GSAP',
  'jQuery',
  'Socket.IO',
  'NGX-Device-Detector',
];

export const dependencyLinks: Array<string> = [
  'https://angular.io',
  'https://fontawesome.com',
  'https://greensock.com/gsap/',
  'https://jquery.com',
  'https://socket.io',
  'https://koderlabs.github.io/ngx-device-detector/',
];

export class Globals {

  private handset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  private handset: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.handset$.subscribe(event => this.handset = event);
  }

  public isHandset(): boolean {
    return this.handset;
  }

  public getHandset(): Observable<boolean> {
    return this.handset$;
  }

  public getActionBarHeight(): string {
    return this.isHandset() ? actionBarHeightMobile : actionBarHeightDesktop;
  }

  public getSideMargin(): string {
    return this.isHandset() ? sideMarginMobile : sideMarginDesktop;
  }
}
