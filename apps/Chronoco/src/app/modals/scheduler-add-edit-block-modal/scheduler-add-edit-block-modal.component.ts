import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventBlockType } from '../../models/event-block-type.enum';
import { SchedulerTranslateBlockTypePipe } from '../../pipes/scheduler-translate-block-type.pipe';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SchedulerLegendStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-legend.store';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { SelectInputComponent } from '@chronoco-fe/ui/select-input/select-input.component';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { TextareaComponent } from '@chronoco-fe/ui/textarea/textarea.component';
import { IEventBlock } from '@chronoco-fe/models/i-event-block';

interface IAddLegendForm {
  name: FormControl<string>;
  blocksType: FormControl<EventBlockType>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-scheduler-add-edit-block-modal',
  imports: [
    ModalComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SelectInputComponent,
    InputComponent,
    TextareaComponent,
  ],
  templateUrl: './scheduler-add-edit-block-modal.component.html',
  styleUrl: './scheduler-add-edit-block-modal.component.css',
  providers: [
    SchedulerTranslateBlockTypePipe,
  ],
})
export class SchedulerAddEditBlockModalComponent implements OnInit {
  public editedLegend: IEventBlock = inject(DIALOG_DATA);

  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly schedulerTranslateBlockTypePipe: SchedulerTranslateBlockTypePipe = inject(SchedulerTranslateBlockTypePipe);

  public readonly blockTypes: Signal<EventBlockType[]> = computed(() => Object.values(EventBlockType));
  public readonly blockTypesOptions: Signal<ISelectOption[]> = computed(() => Object.values(EventBlockType).map((el) => ({ display: this.schedulerTranslateBlockTypePipe.transform(el), value: el })));

  public form: FormGroup<IAddLegendForm>;

  public ngOnInit(): void {
    this.buildForm();
  }

  public submitHandler(): void {
    if (this.editedLegend) {
      this.editLegendHandler();
    } else {
      this.addLegendHandler();
    }

    this.dialogRef.close();
  }

  private addLegendHandler(): void {
    const { name, blocksType, description } = this.form.getRawValue();
    this.legendStore.createLegendDefinition(name, blocksType, description);
  }

  private editLegendHandler(): void {
    this.legendStore.updateLegendDefinition(this.editedLegend.id, this.form.getRawValue());
  }

  private buildForm(): void {
    const blockTypeValue = this.editedLegend?.type || this.blockTypes()[0];

    this.form = this.formBuilder.group<IAddLegendForm>({
      name: new FormControl(this.editedLegend?.name, [ Validators.required ]),
      blocksType: new FormControl(blockTypeValue, [ Validators.required ]),
      description: new FormControl(this.editedLegend?.description),
    });
  }
}
