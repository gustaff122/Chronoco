import { Component, computed, inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LegendType } from '@chronoco-fe/models/legend-type.enum';
import { SchedulerTranslateBlockTypePipe } from '../../pipes/scheduler-translate-block-type.pipe';
import { ModalComponent } from '../../ui/modal/modal.component';
import { SchedulerLegendStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-legend.store';
import { ButtonComponent } from '@chronoco-fe/ui/button/button.component';
import { SelectInputComponent } from '@chronoco-fe/ui/select-input/select-input.component';
import { ISelectOption } from '@chronoco-fe/models/i-select-option';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { InputComponent } from '@chronoco-fe/ui/input/input.component';
import { TextareaComponent } from '@chronoco-fe/ui/textarea/textarea.component';
import { ILegend } from '@chronoco-fe/models/i-legend';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { SchedulerInstancesStore } from '@chronoco-fe/core/planner/views/planner-view/components/scheduler-grid/stores/scheduler-instances.store';

interface IAddLegendForm {
  name: FormControl<string>;
  blocksType: FormControl<LegendType>;
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
    CdkConnectedOverlay,
    CdkOverlayOrigin,
  ],
  templateUrl: './scheduler-add-edit-block-modal.component.html',
  styleUrl: './scheduler-add-edit-block-modal.component.css',
  providers: [
    SchedulerTranslateBlockTypePipe,
  ],
})
export class SchedulerAddEditBlockModalComponent implements OnInit {
  public editedLegend: ILegend = inject(DIALOG_DATA);

  private readonly legendStore: SchedulerLegendStore = inject(SchedulerLegendStore);
  private readonly instancesStore: SchedulerInstancesStore = inject(SchedulerInstancesStore);
  private readonly formBuilder: FormBuilder = inject(FormBuilder);
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly schedulerTranslateBlockTypePipe: SchedulerTranslateBlockTypePipe = inject(SchedulerTranslateBlockTypePipe);

  public readonly blockTypes: Signal<LegendType[]> = computed(() => Object.values(LegendType));
  public readonly blockTypesOptions: Signal<ISelectOption[]> = computed(() => Object.values(LegendType).map((el) => ({ display: this.schedulerTranslateBlockTypePipe.transform(el), value: el })));

  public isDeleteOverlayOpen: WritableSignal<boolean> = signal(false);

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

  public openDeleteOverlay(): void {
    this.isDeleteOverlayOpen.set(true);
  }

  public closeDeleteOverlay(): void {
    this.isDeleteOverlayOpen.set(false);
  }

  public deleteLegendHandler(): void {
    this.legendStore.deleteLegendDefinition(this.editedLegend.id);
    this.instancesStore.deleteByLegendId(this.editedLegend.id);
    this.dialogRef.close();
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
