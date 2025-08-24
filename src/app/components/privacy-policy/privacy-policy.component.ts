import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: false,
})
export class PrivacyPolicyComponent {
  @Output() close = new EventEmitter();

  onClickClose(): void {
    this.close.emit();
  }
}
