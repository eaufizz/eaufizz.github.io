import { Component, EventEmitter, Output } from '@angular/core';
import { Cookie } from '../../screen/score-app/score-app.component';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  standalone: false,
})
export class PrivacyPolicyComponent {
  @Output() close = new EventEmitter();

  useCookie: boolean = false;

  ngOnInit(): void {
    const stored = localStorage.getItem(Cookie);
    this.useCookie = stored ? JSON.parse(stored) : false;
  }

  onClickClose(): void {
    localStorage.setItem(Cookie, JSON.stringify(this.useCookie));
    this.close.emit();
  }

  toggleUseCookie(): void {
    this.useCookie = !this.useCookie;
  }
}
