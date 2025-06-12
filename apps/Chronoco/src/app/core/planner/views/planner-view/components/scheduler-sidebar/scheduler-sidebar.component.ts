import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SchedulerSidebarBlocksListComponent } from './components/scheduler-sidebar-blocks-list/scheduler-sidebar-blocks-list.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMagnifyingGlass } from '@ng-icons/heroicons/outline';
import { Dialog } from '@angular/cdk/dialog';
import { SchedulerBlocksStore } from '../scheduler-grid/stores/scheduler-blocks/scheduler-blocks.store';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventBlockType } from '@chronoco-fe/models/event-block-type.enum';

interface ISearchForm {
  search: FormControl<string>;
}

@Component({
  selector: 'app-scheduler-sidebar',
  imports: [
    SchedulerSidebarBlocksListComponent,
    NgIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './scheduler-sidebar.component.html',
  styleUrl: './scheduler-sidebar.component.css',
  viewProviders: [
    provideIcons({ heroMagnifyingGlass }),
  ],
})
export class SchedulerSidebarComponent implements OnInit {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly blockStore: SchedulerBlocksStore = inject(SchedulerBlocksStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly EventBlockType = EventBlockType;

  public form: FormGroup<ISearchForm>;

  public ngOnInit(): void {
    this.buildForm();
    this.initFormListener();
  }

  public openAddModal(): void {
    import('@chronoco-fe/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component').then(({ SchedulerAddEditBlockModalComponent }) => {
      this.dialog.open(SchedulerAddEditBlockModalComponent, {
        providers: [
          {
            provide: SchedulerBlocksStore,
            useValue: this.blockStore,
          },
        ],
      });
    });
  }

  private initFormListener(): void {
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ search }) => this.blockStore.search(search));
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<ISearchForm>({
      search: new FormControl(null),
    });
  }
}
