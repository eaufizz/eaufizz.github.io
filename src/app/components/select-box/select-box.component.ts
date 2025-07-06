import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SelectOption {
  name: string;
  value: string;
}

@Component({
  selector: 'app-select-box',
  templateUrl: './select-box.component.html',
  styleUrl: './select-box.component.scss',
  standalone: false,
})
export class SelectBoxComponent {
  @Input() options: SelectOption[] = [];
  @Input() selectedOption?: SelectOption;
  @Output() selectedOptionChange = new EventEmitter<SelectOption>();

  onSelect(option: SelectOption): void {
    this.selectedOption = option;
    this.selectedOptionChange.emit(option);
  }

  customCompare = (a: SelectOption, b: SelectOption) => {
    return a?.value === b?.value;
  };
}
