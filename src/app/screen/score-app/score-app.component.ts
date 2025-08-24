import { Component } from '@angular/core';
import { Router } from '@angular/router';

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
