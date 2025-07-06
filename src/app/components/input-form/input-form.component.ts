import {
  Component,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss',
  standalone: false,
})
export class InputFormComponent {
  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  @Output() valueChange = new EventEmitter<string>();
  @Input() label: string = "";
  @Input() value: string = "";
  @Input() number: number = 0;

  onInputChange(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
