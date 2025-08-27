import { Component, computed, inject, input, InputSignal, signal, Signal, WritableSignal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronDown, heroChevronUp, heroPencilSquare } from '@ng-icons/heroicons/outline';
import { SchedulerBlockTypeColorIntensePipe } from '@chronoco-fe/pipes/scheduler-block-type-color.pipe';
import { SchedulerTranslateBlockTypePipe } from '@chronoco-fe/pipes/scheduler-translate-block-type.pipe';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';
import { IEventBlock } from '@chronoco-fe/models/i-event-block';
import { SchedulerLegendStore } from '../../../scheduler-grid/stores/scheduler-legend.store';
import { Dialog } from '@angular/cdk/dialog';

@Component({
  selector: 'app-scheduler-sidebar-blocks-list',
  imports: [
    SchedulerTranslateBlockTypePipe,
    NgIcon,
    SchedulerBlockTypeColorIntensePipe,
  ],
  templateUrl: './scheduler-sidebar-blocks-list.component.html',
  styleUrl: './scheduler-sidebar-blocks-list.component.css',
  viewProviders: [
    provideIcons({ heroChevronUp, heroChevronDown, heroPencilSquare }),
  ],
})
export class SchedulerSidebarBlocksListComponent {
  public blocksType: InputSignal<EventBlockType> = input.required();

  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly dialog: Dialog = inject(Dialog);

  public readonly legends: Signal<IEventBlock[]> = computed(() => this.legendStore.filteredLegends().filter(({ type }) => type === this.blocksType()));

  public readonly selectedLegendBlock: Signal<IEventBlock> = this.legendStore.selectedLegendBlock;

  public readonly isRolledUp: WritableSignal<boolean> = signal(false);

  public roll(): void {
    this.isRolledUp.update(state => !state);
  }

  public selectItemHandler(id: string): void {
    this.legendStore.selectLegendForDrawing(id);
  }

  public openEditLegendModalHandler(data: IEventBlock): void {
    import('@chronoco-fe/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component').then(({ SchedulerAddEditBlockModalComponent }) => {
      this.dialog.open(SchedulerAddEditBlockModalComponent, {
        data,
        providers: [
          {
            provide: SchedulerLegendStore,
            useValue: this.legendStore,
          },
        ],
      });
    });
  }
}
