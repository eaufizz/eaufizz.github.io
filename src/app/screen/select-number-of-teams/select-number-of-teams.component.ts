import { Component } from '@angular/core';
import { Router } from '@angular/router'
import { ScoreAppService } from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-select-number-of-teams',
  templateUrl: './select-number-of-teams.component.html',
  styleUrl: './select-number-of-teams.component.scss',
  standalone: false,
})
export class SelectNumberOfTeamsComponent {

  constructor(
    private router: Router,
    private scoreAppService: ScoreAppService,
  ) {}

  ngOnInit(): void {
    this.scoreAppService.setSelectedTeams([]);
    this.scoreAppService.setTeamCount(0);
    this.scoreAppService.setSetCount(0);
  }

  moveToHome(): void {
    this.router.navigate(['']);
  }

  setTeamCount(value: number): void {
    this.scoreAppService.setTeamCount(value);
    this.router.navigate(["set-member"]);
    this.scoreAppService.setSelectedTeams([])
  }
}
