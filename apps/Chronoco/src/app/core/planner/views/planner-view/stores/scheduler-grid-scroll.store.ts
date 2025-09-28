import { ElementRef, Injectable, Signal } from '@angular/core';

interface AutoScrollConfig {
  margin: number;
  speed: number;
  intervalMs: number;
}

@Injectable()
export class SchedulerGridScrollStore {
  public scrollContainer: Signal<ElementRef<HTMLElement>>;

  private autoScrollIntervalId: number = null;

  private currentScrollDirection = { x: 0, y: 0 };

  private readonly autoScrollConfig: AutoScrollConfig = {
    margin: 50,
    speed: 15,
    intervalMs: 16,
  };

  public updateAutoScroll(clientX: number, clientY: number) {
    if (!this.scrollContainer().nativeElement) {
      return;
    }

    const rect = this.scrollContainer().nativeElement.getBoundingClientRect();
    const { margin } = this.autoScrollConfig;

    let scrollX = 0;
    let scrollY = 0;

    const distanceFromLeft = clientX - rect.left;
    const distanceFromRight = rect.right - clientX;

    if (distanceFromLeft < margin && distanceFromLeft >= 0) {
      scrollX = -this.autoScrollConfig.speed * (1 - distanceFromLeft / margin);
    } else if (distanceFromRight < margin && distanceFromRight >= 0) {
      scrollX = this.autoScrollConfig.speed * (1 - distanceFromRight / margin);
    } else if (clientX < rect.left) {
      scrollX = -this.autoScrollConfig.speed;
    } else if (clientX > rect.right) {
      scrollX = this.autoScrollConfig.speed;
    }

    const distanceFromTop = clientY - rect.top;
    const distanceFromBottom = rect.bottom - clientY;

    if (distanceFromTop < margin && distanceFromTop >= 0) {
      scrollY = -this.autoScrollConfig.speed * (1 - distanceFromTop / margin);
    } else if (distanceFromBottom < margin && distanceFromBottom >= 0) {
      scrollY = this.autoScrollConfig.speed * (1 - distanceFromBottom / margin);
    } else if (clientY < rect.top) {
      scrollY = -this.autoScrollConfig.speed;
    } else if (clientY > rect.bottom) {
      scrollY = this.autoScrollConfig.speed;
    }

    this.setScrollDirection(scrollX, scrollY);
  }

  private setScrollDirection(x: number, y: number) {
    const newDirection = { x: Math.round(x), y: Math.round(y) };

    if (newDirection.x !== this.currentScrollDirection.x ||
      newDirection.y !== this.currentScrollDirection.y) {

      this.currentScrollDirection = newDirection;

      if (newDirection.x === 0 && newDirection.y === 0) {
        this.stopAutoScroll();
      } else {
        this.startAutoScroll();
      }
    }
  }

  private startAutoScroll() {
    if (this.autoScrollIntervalId !== null) {
      return;
    }

    this.autoScrollIntervalId = window.setInterval(() => {
      if (!this.scrollContainer().nativeElement) {
        this.stopAutoScroll();
        return;
      }

      if (this.currentScrollDirection.x !== 0 || this.currentScrollDirection.y !== 0) {
        this.scrollContainer().nativeElement.scrollBy(
          this.currentScrollDirection.x,
          this.currentScrollDirection.y,
        );
      }
    }, this.autoScrollConfig.intervalMs);
  }

  public stopAutoScroll() {
    if (this.autoScrollIntervalId !== null) {
      clearInterval(this.autoScrollIntervalId);
      this.autoScrollIntervalId = null;
    }
    this.currentScrollDirection = { x: 0, y: 0 };
  }
}