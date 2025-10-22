import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-data-info',
  templateUrl: './data-info.component.html',
  styleUrl: './data-info.component.scss',
  standalone: false,
})
export class DataInfoComponent {
  @Output() close = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }
}
