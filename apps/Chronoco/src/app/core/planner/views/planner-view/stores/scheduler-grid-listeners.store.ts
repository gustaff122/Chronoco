import { Injectable } from '@angular/core';

@Injectable()
export class SchedulerGridListenersStore {
  private documentMouseMoveListener?: (event: MouseEvent) => void;
  private documentMouseUpListener?: (event: MouseEvent) => void;

  public attachDocumentListeners(
    onMouseMove: (event: MouseEvent) => void,
    onMouseUp: () => void,
  ): void {
    this.detachDocumentListeners();

    this.documentMouseMoveListener = (event: MouseEvent) => onMouseMove(event);
    this.documentMouseUpListener = () => onMouseUp();

    document.addEventListener('mousemove', this.documentMouseMoveListener);
    document.addEventListener('mouseup', this.documentMouseUpListener);
  }

  public detachDocumentListeners(): void {
    if (this.documentMouseMoveListener) {
      document.removeEventListener('mousemove', this.documentMouseMoveListener);
      this.documentMouseMoveListener = undefined;
    }

    if (this.documentMouseUpListener) {
      document.removeEventListener('mouseup', this.documentMouseUpListener);
      this.documentMouseUpListener = undefined;
    }
  }
}
