import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SchedulerSidebarBlocksListComponent } from './components/scheduler-sidebar-blocks-list/scheduler-sidebar-blocks-list.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { Dialog } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';
import { SchedulerLegendStore } from '../scheduler-grid/stores/scheduler-legend.store';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';

interface ISearchForm {
  search: FormControl<string>;
}

@Component({
  selector: 'app-scheduler-sidebar',
  imports: [
    SchedulerSidebarBlocksListComponent,
    NgIcon,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './scheduler-sidebar.component.html',
  styleUrl: './scheduler-sidebar.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class SchedulerSidebarComponent implements OnInit {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly EventBlockType = EventBlockType;

  public form: FormGroup<ISearchForm>;

  public ngOnInit(): void {
    this.buildForm();
    this.initFormListener();

    this.legendStore.createLegendDefinition('Scheduler', EventBlockType.LECTURE);
  }

  public openAddModal(): void {
    import('@chronoco-fe/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component').then(({ SchedulerAddEditBlockModalComponent }) => {
      this.dialog.open(SchedulerAddEditBlockModalComponent, {
        providers: [
          {
            provide: SchedulerLegendStore,
            useValue: this.legendStore,
          },
        ],
      });
    });
  }

  private initFormListener(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ search }) => this.legendStore.search(search));
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<ISearchForm>({
      search: new FormControl(null),
    });
  }
}
