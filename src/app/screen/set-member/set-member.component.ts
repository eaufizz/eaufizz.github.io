import { Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ScoreAppService,
  Team,
  Player,
} from '../../core/service/ScoreAppService';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { InputFormComponent } from '../../components/input-form/input-form.component';
import GraphemeSplitter from 'grapheme-splitter';

@Component({
  selector: 'app-set-member',
  templateUrl: './set-member.component.html',
  styleUrl: './set-member.component.scss',
  standalone: false,
})
export class SetMemberComponent {
  currentTeams: Team[] = [];
  teamCount: number = 0;
  showRegisterPage: boolean = false;
  registeredPlayer: Player[] = [];
  selectedID: string[] = [];
  showStartDialog: boolean = false;
  renderFlag: boolean = true;
  private subscription = new Subscription();

  constructor(
    private scoreAppService: ScoreAppService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.currentTeams = this.scoreAppService.getSelectedTeams().slice();
    this.teamCount = this. scoreAppService.getTeamCount();
    if (this.teamCount === 0) {
      this.moveToBack();
    }
    if (this.currentTeams.length === 0) {
      for (let i = 0; i < this.teamCount; i++) {
        const team: Team = {
          name: `チーム${i + 1}`,
          member: [],
          score: 0,
          totalScore: 0,
          miss: 0,
          currentPlayer: {name: "", id: "", sets: []},
        };
        this.currentTeams.push(team);
    }
    }

    this.subscription.add(
      this.scoreAppService.getRegisteredPlayer$().subscribe((playerList) => {
        this.registeredPlayer = playerList;
      })
    );

    this.subscription.add(
      this.scoreAppService.getSelectedTeams$().subscribe((teams: Team[]) => {
        this.selectedID = teams.flatMap(team => team.member.map(p => p.id));
      })
    );
  }

  goNext(): void {
    this.router.navigate(["/game"]);
  }

  moveToBack(): void {
    this.router.navigate(["select-team"]);
  }

  moveToHome(): void {
    this.router.navigate([""]);
  }

  onChangeMember(index: number, team: Team): void {
    this.currentTeams[index] = {
      ...team,
      member: [...team.member]
    };
    this.currentTeams = [...this.currentTeams];
    this.scoreAppService.setSelectedTeams(this.currentTeams);
  }

  toggleShowStartDialog(): void {
    this.showStartDialog = !this.showStartDialog;
  }

  @ViewChild('inputRef') inputRef!: InputFormComponent;

  playerName: string = "";
  isDuplicate: boolean = false;
  isOver: boolean = false;
  showCheckDialog: boolean = false;

  toggleShowRegisterPage(): void {
    this.showRegisterPage = !this.showRegisterPage;
  }

  onInputPlayerName(value: string): void {
    this.playerName = value;
    this.isDuplicate = this.scoreAppService.isDuplicatePlayer(this.playerName);
    if (this.getCustomLength(value) > 10) {
      this.isOver = true;
    } else {
      this.isOver = false;
    }
  }

  getCustomLength(value: string): number {
    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(value);
    return graphemes.reduce((sum, char) => {
      return sum + (char.match(/[ -~]/) ? 0.5 : 1);
    }, 0);
  }

  toggleShowDialog(): void {
    this.showCheckDialog = !this.showCheckDialog;
  }

  onClickAgree(): void {
    this.scoreAppService.registerNewPlayer(this.playerName);
    this.showCheckDialog = false;
    this.inputRef.onInputChange("");
  }

  startGame(): void {
    this.scoreAppService.setSnapShot([]);
    this.scoreAppService.setSetCount(1);
    this.router.navigate(["game"]);
  }
}
