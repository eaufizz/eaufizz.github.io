import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ScoreAppService,
  Team,
  Player,
  SnapShot,
} from '../../core/service/ScoreAppService';

@Component({
  selector: 'app-game',
  templateUrl: './game.screen.html',
  styleUrls: ['./game.screen.scss'],
  standalone: false,
})
export class GameComponent {
  teams: Team[] = [];
  activeTeam: Team = {
    name: "",
    member: [],
    score: 0,
    totalScore: 0,
    miss: 0,
    currentPlayer: {name: "", id: "", sets: []},
  };
  setCount: number = 0;
  selectedButton: number = 13;
  snapShot: SnapShot[] = [];
  showDialog: boolean = false;
  navigateRoot: string = "";
  isBreak: boolean = true;
  showInfo: boolean = false;
  showInfoText: boolean = false;

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.snapShot = this.scoreAppService.getSnapShot().slice();
    if (this.snapShot.length !== 0) {
      this.setCount = this.scoreAppService.getSetCount();
      this.onClickBack();
      return;
    }
    this.teams = this.scoreAppService.getSelectedTeams();
    if (this.teams.length === 0) {
      this.moveToSelectTeam();
    }
    this.setCount = this.scoreAppService.getSetCount();
    for (const team of this.teams) {
      team.score = 0;
      team.miss = 0;
      team.currentPlayer = team.member[0];
      for (const member of team.member) {
        if (this.setCount === 1) {
          member.sets = [];
        }
        const set = {
          throws: [],
          score: 0,
          break: -1,
          critical: 0,
          over: 0,
          dropout: false,
          win: false,
          turn: 0,
        }
        member.sets.push(set);
      }
    }
    this.activeTeam = this.teams[0];
  }

  onClickScoreButton(score: number) {
    this.selectedButton = score;
  }

  onClickSubmit(isCritical: boolean): void {
    this.saveSnapShot();
    if (typeof this.activeTeam?.score === "number") {
      this.activeTeam.score += this.selectedButton;
      for (const member of this.activeTeam.member) {
        member.sets[this.setCount - 1].turn ++;
        member.sets[this.setCount - 1].score += this.selectedButton;
      }
      this.activeTeam.currentPlayer.sets[this.setCount - 1].throws.push(this.selectedButton);
      if (this.isBreak) {
        this.activeTeam.currentPlayer.sets[this.setCount - 1].break = this.selectedButton;
      }
      if (isCritical) {
        this.activeTeam.currentPlayer.sets[this.setCount - 1].critical ++;
        this.showInfoText = true;
        setTimeout(() => {this.showInfoText = false}, 1000);
      }
      if (this.activeTeam.score > 50) {
        this.activeTeam.score = 25;
        this.activeTeam.currentPlayer.sets[this.setCount - 1].over ++;
      }
      if (this.activeTeam.score === 50 && typeof this.activeTeam.totalScore === "number") {
        this.finishSet();
      }
      if (this.selectedButton === 0 && typeof this.activeTeam.miss === "number") {
        this.activeTeam.miss += 1;
        if (this.activeTeam.miss === 3) {
          this.activeTeam.score = 0;
          for (const member of this.activeTeam.member) {
            member.sets[this.setCount - 1].dropout = true;
          }
        }
      } else {
        this.activeTeam.miss = 0;
      }
    }
    this.changeCurrentPlayer();
    if (this.checkGameIsSet()) {
      return;
    }
    this.changeActiveTeam();
    this.selectedButton = 13;
    this.isBreak = false;
    this.debug();
  }

  saveSnapShot(): void {
    const snap: SnapShot = {
      teams: structuredClone(this.teams),
      activeTeam: structuredClone(this.activeTeam),
      isBreak: this.isBreak,
    }
    this.snapShot.push(snap);
  }

  checkGameIsSet(): boolean {
    const result = this.teams.filter((team) =>
      team.miss < 3
    );
    if (this.teams.length === 1) {
      if (result.length === 0) {
        this.finishSet();
        return true;
      }
    } else {
      if (result.length <= 1) {
        result[0].score = 50;
        const index = this.teams.findIndex((team) =>
          result[0].name === team.name
        );
        this.teams[index] = result[0];
        this.finishSet();
        return true;
      }
    }
    return false;
  }

  changeActiveTeam(): void {
    const activeIndex = this.teams.indexOf(this.activeTeam);
    if (activeIndex === this.teams.length - 1) {
      this.activeTeam = this.teams[0];
    } else {
      this.activeTeam = this.teams[activeIndex + 1];
    }
    if (this.activeTeam.miss === 3) {
      this.changeActiveTeam();
    }
  }

  changeCurrentPlayer(): void {
    const activeIndex = this.activeTeam.member.indexOf(this.activeTeam.currentPlayer);
    if (activeIndex === this.activeTeam.member.length - 1) {
      this.activeTeam.currentPlayer = this.activeTeam.member[0];
    } else {
      this.activeTeam.currentPlayer = this.activeTeam.member[activeIndex + 1];
    }
  }

  finishSet(): void {
    for (const member of this.activeTeam.member) {
      if (this.activeTeam.score === 50) {
        member.sets[this.setCount - 1].win = true;
        if (this.teams.length === 1) {
          member.sets[this.setCount - 1].win = undefined;
        }
      }
    }
    for (const team of this.teams) {
      team.totalScore += team.score;
    }
    if (this.teams.filter((team) => team.miss >= 3).length === this.teams.length - 1) {
      const winner = this.teams.find((team) => team.miss < 3);
      if (winner) {
        for (const member of winner.member) {
          member.sets[this.setCount - 1].win = true;
          if (this.teams.length === 1) {
            member.sets[this.setCount - 1].win = undefined;
          }
        }
      }
    }
    this.scoreAppService.setSelectedTeams(this.teams);
    this.scoreAppService.setSnapShot(this.snapShot);
    this.router.navigate(["result"]);
  }

  onClickBack(): void {
    const latest = this.snapShot.pop();
    if (latest !== undefined) {
      this.teams = latest.teams;
      const matched = this.teams.find(team => team.name === latest.activeTeam.name);
      if (matched) {
        this.activeTeam = matched;
      }
      this.isBreak = latest.isBreak;
    }
    this.selectedButton = 13;
  }

  moveToBack(): void {
    this.showDialog = true;
    this.navigateRoot = "set-member";
  }

  moveToHome(): void {
    this.showDialog = true;
    this.navigateRoot = "";
  }

  closeDialog(): void {
    this.showDialog = false;
  }

  moveToSelectTeam(): void {
    this.router.navigate(["select-team"])
  }

  openInfo(): void {
    this.showInfo = true;
  }

  closeInfo(): void {
    this.showInfo = false;
  }

  debug(): void {
    const index = this.setCount - 1
    for (const team of this.teams) {
      for (const member of team.member) {
        console.log("______________________________________");
        console.log("プレイヤー名: " + member.name);
        console.log("ID: " + member.id);
        console.log("経過ターン: " + member.sets[index].turn);
        console.log("スコア: " + member.sets[index].score)
        console.log("獲得点数↓");
        console.log(member.sets[index].throws);
        console.log("ブレイク: " + member.sets[index].break);
        console.log("狙い通り数: " + member.sets[index].critical);
        console.log("オーバー数: " + member.sets[index].over);
        console.log("失格?: " + member.sets[index].dropout);
        console.log("勝ち?: " + member.sets[index].win);
      }
    }
  }
}
