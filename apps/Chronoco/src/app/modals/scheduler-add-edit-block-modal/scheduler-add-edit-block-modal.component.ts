import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventBlockType } from '../../models/event-block-type.enum';
import { SchedulerTranslateBlockTypePipe } from '../../pipes/scheduler-translate-block-type.pipe';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SchedulerLegendStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-legend.store';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';

interface IAddLegendForm {
  name: FormControl<string>;
  blocksType: FormControl<EventBlockType>;
}

@Component({
  selector: 'app-scheduler-add-edit-block-modal',
  imports: [
    ModalComponent,
    SchedulerTranslateBlockTypePipe,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './scheduler-add-edit-block-modal.component.html',
  styleUrl: './scheduler-add-edit-block-modal.component.css',
})
export class SchedulerAddEditBlockModalComponent implements OnInit {
  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);

  public readonly blockTypes: Signal<EventBlockType[]> = computed(() => Object.values(EventBlockType));

  public form: FormGroup<IAddLegendForm>;

  public ngOnInit(): void {
    this.buildForm();
  }

  public addLegendHandler(): void {
    const { name, blocksType } = this.form.getRawValue();
    this.legendStore.createLegendDefinition(name, blocksType);
  }

  private buildForm(): void {
    this.form = this.formBuilder.group<IAddLegendForm>({
      name: new FormControl(null, [ Validators.required ]),
      blocksType: new FormControl(this.blockTypes()[0], [ Validators.required ]),
    });
  }
}
