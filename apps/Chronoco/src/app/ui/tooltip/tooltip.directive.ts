import { ComponentRef, DestroyRef, Directive, ElementRef, inject, input, InputSignal, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipComponent, TooltipTheme } from './tooltip.component';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective implements OnInit, OnDestroy {
  public appTooltip: InputSignal<string> = input.required();
  public appTooltipTheme: InputSignal<TooltipTheme> = input('dark' as TooltipTheme);
  public appTooltipOffsetY: InputSignal<number> = input(15);
  public appTooltipOffsetX: InputSignal<number> = input(0);

  //TODO
  public appTooltipShowOnlyOnEllipsis: InputSignal<boolean> = input(false);

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);

  private tooltipRef?: ComponentRef<TooltipComponent>;

  public ngOnInit(): void {
    this.initMouseEnterListener();
    this.initMouseLeaveListener();
  }

  public ngOnDestroy(): void {
    this.destroyTooltip();
  }

  private initTooltip(): void {
    if (this.tooltipRef) return;

    this.tooltipRef = this.viewContainerRef.createComponent(TooltipComponent);
    this.tooltipRef.setInput('text', this.appTooltip());
    this.tooltipRef.setInput('theme', this.appTooltipTheme());

    const hostEl = this.elementRef.nativeElement;
    const rect = hostEl.getBoundingClientRect();

    const tooltipEl = this.tooltipRef.location.nativeElement as HTMLElement;
    tooltipEl.style.position = 'absolute';
    tooltipEl.style.top = `${rect.bottom + window.scrollY + this.appTooltipOffsetY()}px`;
    const parent = hostEl.parentElement;
    const parentRect = parent?.getBoundingClientRect() ?? rect;

    let left = rect.left + window.scrollX;
    if (left < parentRect.left + window.scrollX) left = parentRect.left + window.scrollX;
    if (left + tooltipEl.offsetWidth > parentRect.right + window.scrollX)
      left = parentRect.right + window.scrollX - tooltipEl.offsetWidth;

    tooltipEl.style.left = `${left + this.appTooltipOffsetX()}px`;
    document.body.appendChild(tooltipEl);
  }

  //TODO
  private isEllipsisActive(): boolean {
    const el = this.elementRef.nativeElement;
    return el.scrollWidth > el.clientWidth;
  }

  private destroyTooltip(): void {
    if (this.tooltipRef) {
      this.tooltipRef.destroy();
      this.tooltipRef = undefined;
    }
  }

  private initMouseEnterListener(): void {
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseenter')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.appTooltipShowOnlyOnEllipsis() || this.isEllipsisActive()) {
          this.initTooltip();
        }
      });
  }

  private initMouseLeaveListener(): void {
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mouseleave')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.destroyTooltip());
  }
}