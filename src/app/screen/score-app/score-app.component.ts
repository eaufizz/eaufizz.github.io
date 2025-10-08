import { Component } from '@angular/core';
import { Router } from '@angular/router';

export const Cookie = "cookie";

@Component({
  selector: 'app-score',
  templateUrl: './score-app.component.html',
  styleUrls: ['./score-app.component.scss'],
  standalone: false,
})
export class ScoreAppComponent {
  showPrivacyPolicy: boolean = false;

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    const stored = localStorage.getItem(Cookie);
    const useCookie = stored ? JSON.parse(stored) : false;
    if (!useCookie) {
      this.showPrivacyPolicy = true;
    }
  }

  onClickStart(): void {
    this.router.navigate(['/select-team']);
  }

  onClickViewData(): void {
    this.router.navigate(["view-data"]);
  }

  togglePrivacyPolicy(): void {
    this.showPrivacyPolicy = !this.showPrivacyPolicy;
  }
}
