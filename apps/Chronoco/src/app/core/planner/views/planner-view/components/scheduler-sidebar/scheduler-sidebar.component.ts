import { Component, DestroyRef, inject, OnInit, Signal } from '@angular/core';
import { SchedulerSidebarBlocksListComponent } from './components/scheduler-sidebar-blocks-list/scheduler-sidebar-blocks-list.component';
import { Dialog } from '@angular/cdk/dialog';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LegendType } from '@chronoco-fe/models/legend-type.enum';
import { SchedulerLegendStore } from '../scheduler-grid/stores/scheduler-legend.store';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { SchedulerSearchStore } from '../scheduler-grid/stores/scheduler-search.store';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChevronLeft, heroChevronRight } from '@ng-icons/heroicons/outline';
import { SchedulerSearchScrollStore } from '../scheduler-grid/stores/scheduler-search-scroll.store';
import { SchedulerInstancesStore } from '../scheduler-grid/stores/scheduler-instances.store';

interface ISearchForm {
  search: FormControl<string>;
}

@Component({
  selector: 'app-scheduler-sidebar',
  imports: [
    SchedulerSidebarBlocksListComponent,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    NgIcon,
  ],
  templateUrl: './scheduler-sidebar.component.html',
  styleUrl: './scheduler-sidebar.component.css',
  viewProviders: [
    provideIcons({ heroChevronLeft, heroChevronRight }),
  ],
})
export class SchedulerSidebarComponent implements OnInit {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly searchStore: SchedulerSearchStore = inject(SchedulerSearchStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly searchScrollStore: SchedulerSearchScrollStore = inject(SchedulerSearchScrollStore);
  protected readonly EventBlockType: typeof LegendType = LegendType;

  public readonly foundInstancesCount: Signal<number> = this.searchScrollStore.foundInstancesCount;
  public readonly currentFoundInstanceNumber: Signal<number> = this.searchScrollStore.currentFoundInstanceNumber;
  public readonly searchFilter: Signal<string> = this.searchStore.searchFilter;

  public form: FormGroup<ISearchForm>;

  public ngOnInit(): void {
    this.buildForm();
    this.initFormListener();

    this.legendStore.createLegendDefinition('Scheduler', LegendType.LECTURE, null);
  }

  public scrollToNextInstanceHandler(): void {
    this.searchScrollStore.scrollToNextInstance();
  }

  public scrollToPreviousInstanceHandler(): void {
    this.searchScrollStore.scrollToPreviousInstance();
  }

  public openAddModal(): void {
    import('@chronoco-fe/modals/scheduler-add-edit-block-modal/scheduler-add-edit-block-modal.component').then(({ SchedulerAddEditBlockModalComponent }) => {
      this.dialog.open(SchedulerAddEditBlockModalComponent, {
        providers: [
          {
            provide: SchedulerLegendStore,
            useValue: this.legendStore,
          },
          {
            provide: SchedulerInstancesStore,
            useValue: this.instancesStore,
          },
        ],
      });
    });
  }

  private initFormListener(): void {
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ search }) => this.searchStore.search(search));
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<ISearchForm>({
      search: new FormControl(null),
    });
  }
}
