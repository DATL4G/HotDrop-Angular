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

  public transformFromTo(elem, defaultValue, newValue) {
    gsap.fromTo(elem, { attr: { r: defaultValue } }, { duration: 1, repeat: -1, ease: 'none', attr: { r: newValue } })
  }

  public transformTo(elem, newValue) {
    gsap.to(elem, { duration: 1, repeat: -1, ease: 'none', attr: { r: newValue } })
  }
}
