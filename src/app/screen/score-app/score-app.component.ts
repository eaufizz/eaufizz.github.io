import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-score',
  templateUrl: './score-app.component.html',
  styleUrls: ['./score-app.component.scss'],
  standalone: false,
})
export class ScoreAppComponent {
  isStartHovered: boolean = false;
  isSettingsHovered: boolean = false;

  constructor(
    private router: Router,
  ) {}

  onClickStart(): void {
    this.router.navigate(['/select-team']);
  }

  onClickSettings(): void {

  }

  toggleStart(): void {
    this.isStartHovered = !this.isStartHovered;
  }

  toggleSettings(): void {
    this.isSettingsHovered = !this.isSettingsHovered;
  }
}
