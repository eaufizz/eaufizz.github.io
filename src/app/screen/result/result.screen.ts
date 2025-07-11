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
  showDialog: boolean = false;
  navigateRoot: string = "";

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.teams = this.scoreAppService.getSelectedTeams();
    if (this.teams.length === 0) {
      this.moveToSelectTeam();
    }
    this.setCount = this.scoreAppService.getSetCount();
    if (this.setCount === 0) {
      this.moveToSelectTeam();
    }
  }

  onClickContinue(): void {
    this.scoreAppService.setSnapShot([]);
    this.scoreAppService.setSetCount(this.setCount + 1);
    if (this.teams.length === 2) {
      [this.teams[0], this.teams[1]] = [this.teams[1], this.teams[0]];
    } else if (this.teams.length >= 3) {
      this.teams.sort((a, b) => a.score - b.score);
    }
    this.router.navigate(["game"]);
  }

  onClickSave(): void {

  }

  onClickNoSave(): void {

  }

  moveToBack(): void {
    this.router.navigate(["game"]);
  }

  moveToHome(): void {
    this.showDialog = true;
    this.navigateRoot = "";
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }

  closeDialog(): void {
    this.showDialog = false;
  }
}
