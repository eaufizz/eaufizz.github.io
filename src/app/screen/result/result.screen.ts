import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
  Player,
} from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-result',
  templateUrl: './result.screen.html',
  styleUrls: ['./result.screen.scss'],
  standalone: false,
})
export class ResultComponent {
  teams: Team[] = [];
  setCount: number = 1;

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teams = this.scoreAppService.getSelectedTeams();
    if (this.teams.length === 0) {
      // this.moveToSelectTeam();
    }
    this.setCount = this.scoreAppService.getSetCount();
    if (this.setCount === 0) {
      // this.moveToSelectTeam();
    }
  }

  onClickContinue(): void {
    this.moveToBack();
  }

  onClickSave(): void {

  }

  onClickNoSave(): void {

  }

  moveToBack(): void {
    this.router.navigate(["game"]);
  }

  moveToHome(): void {
    this.router.navigate([""]);
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }
}
