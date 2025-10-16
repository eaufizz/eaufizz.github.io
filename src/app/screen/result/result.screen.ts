import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
} from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-result',
  templateUrl: './result.screen.html',
  styleUrls: ['./result.screen.scss'],
  standalone: false,
})
export class ResultComponent {
  teams: Team[] = [];
  displayTeams: Team[] = [];
  setCount: number = 1;
  showDialog: boolean = false;
  showContinueDialog: boolean = false;
  navigateRoot: string = "";
  monthOffset: number = 0;

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
    this.displayTeams = this.teams.slice();
    this.displayTeams.sort((a, b) => b.totalScore - a.totalScore);
  }

    onClickContinue(): void {
      this.showContinueDialog = true;
    }

    closeContinueDialog(): void {
      this.showContinueDialog = false;
    }

    continue(): void {
      this.scoreAppService.setSnapShot([]);
      this.scoreAppService.setSetCount(this.setCount + 1);
      if (this.teams.length === 2) {
        [this.teams[0], this.teams[1]] = [this.teams[1], this.teams[0]];
      } else if (this.teams.length >= 3) {
        this.sortTeam();
      }
      this.router.navigate(["game"]);
    }

  sortTeam(): void {
    this.teams.sort((a, b) => a.score - b.score);
    let previous: number = -1;
    const splitted: Team[][] = [];
    for (const team of this.teams) {
      if (team.score !== previous) {
        previous = team.score;
        splitted.push([team]);
      } else {
        splitted[splitted.length - 1].unshift(team);
      }
    }
    this.teams = splitted.flatMap((sorted) => sorted);
    this.scoreAppService.setSelectedTeams(this.teams);
  }

  onClickSave(): void {
    this.scoreAppService.saveCurrentTeamData(this.monthOffset);
    this.router.navigate([""]);
  }

  onClickNoSave(): void {
    this.navigateRoot = "select-team";
    this.showDialog = true;
  }

  moveToBack(): void {
    this.router.navigate(["game"]);
  }

  moveToHome(): void {
    this.navigateRoot = "";
    this.showDialog = true;
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  moveMonth(number: number): void {
    this.monthOffset += number;
  }
}
