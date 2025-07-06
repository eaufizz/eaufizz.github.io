import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: false,
})
export class HeaderComponent {
  @Output() back = new EventEmitter();
  @Output() home = new EventEmitter();
  @Input() title: string = "test";
  @Input() disabled: boolean = false;

  onClickBack(): void {
    this.back.emit();
  }

  onClickHome(): void {
    this.home.emit();
  }
}
