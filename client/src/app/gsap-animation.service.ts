import { Injectable } from '@angular/core';
import { gsap, CSSPlugin } from 'gsap/all';

@Injectable({
  providedIn: 'root'
})
export class GsapAnimationService {
  constructor() {
    gsap.registerPlugin(CSSPlugin);
  }

  public stopFor(elem) {
    gsap.killTweensOf(elem);
  }

  public transformTo(elem, defaultValue, newValue) {
    gsap.fromTo(elem, { attr: { r: defaultValue } }, { duration: 1, repeat: 100, attr: { r: newValue } })
  }
}
