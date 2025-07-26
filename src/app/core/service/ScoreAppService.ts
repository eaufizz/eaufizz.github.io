import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const PLAYERS = "players";
const DATA = "data";

export interface Team {
  name: string;
  member: Player[];
  score: number;
  totalScore: number;
  miss: number;
  currentPlayer: Player,
}

export interface User {
  name: string;
  id: string;
}

export interface PlayDataList {
  data: PlayData[];
}

export interface PlayData {
  id: string;
  matches: Match[];
}

export interface Match {
  date: Date;
  sets: SetData[];
}

export interface Player extends User {
  sets: SetData[];
}

export interface SetData {
  throws: number[];
  score: number;
  break: number;
  critical: number;
  over: number;
  dropout: boolean;
  win: boolean;
  turn: number;
}

export interface SnapShot {
  teams: Team[];
  activeTeam: Team;
  isBreak: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ScoreAppService {
  private teamCount: number = 0;
  private setCount: number = 0;
  private snapShot: SnapShot[] = [];
  private selectedTeams = new BehaviorSubject<Team[]>([]);
  private registeredPlayer = new BehaviorSubject<Player[]>([]);

  private selectedTeams$ = this.selectedTeams.asObservable();
  private registeredPlayer$ = this.registeredPlayer.asObservable();

  constructor() {
    const stored = localStorage.getItem(PLAYERS);
    const guest: User = {
      name: "ゲスト", id: "guest"
    };
    const users: User[] = stored ? JSON.parse(stored) : [];
    users.unshift(guest);
    const players: Player[] = [];
    for (const user of users) {
      const player: Player = {
        name: user.name,
        id: user.id,
        sets: [],
      }
      players.push(player)
    }
    this.registeredPlayer.next(players);
  }

  setSelectedTeams(teams: Team[]): void {
    this.selectedTeams.next(teams);
  }

  getSelectedTeams(): Team[] {
    return this.selectedTeams.value;
  }

  getSelectedTeams$(): Observable<Team[]> {
    return this.selectedTeams$;
  }

  setTeamCount(value: number) {
    this.teamCount = value;
  }

  getTeamCount(): number {
    return this.teamCount;
  }

  setSetCount(value: number) {
    this.setCount = value;
  }

  getSetCount(): number {
    return this.setCount;
  }

  setSnapShot(snapShot: SnapShot[]): void {
    this.snapShot = snapShot;
  }

  getSnapShot(): SnapShot[] {
    return this.snapShot;
  }

  updateRegisteredPlayer(players: Player[]): void {
    this.registeredPlayer.next(players);
    const noGuest = players.filter((player) =>
      player.id !== "guest"
    )
    const users = [];
    for (const player of noGuest) {
      users.push({ name: player.name, id: player.id});
    }
    localStorage.setItem(PLAYERS, JSON.stringify(users));
  }

  addRegisteredPlayer(player: Player): void {
    const newPlayers = this.getRegisteredPlayer();
    newPlayers.push(player);
    this.updateRegisteredPlayer(newPlayers);
  }

  getRegisteredPlayer(): Player[] {
    return this.registeredPlayer.value;
  }

  getRegisteredPlayer$(): Observable<Player[]> {
    return this.registeredPlayer$;
  }

  registerNewPlayer(playerName: string): void {
    if (this.isDuplicatePlayer(playerName)) {
      return ;
    }
    const newPlayer: Player = {
      name: playerName,
      id: uuidv4(),
      sets: [],
    }
    this.addRegisteredPlayer(newPlayer);
  }

  isDuplicatePlayer(playerName: string): boolean {
    return this.getRegisteredPlayer().find((player) =>
      player.name === playerName
    ) !== undefined;
  }

  getPlayerFromID(id: string): Player | undefined {
    return this.registeredPlayer.value.find((player) =>
      player.id === id
    );
  }

  saveCurrentTeamData(): void {
    const stored = localStorage.getItem(DATA);
    let dataList: PlayDataList = { data: [] }
    if (stored !== null) {
      dataList = JSON.parse(stored);
    }
    const now = new Date();
    const jstString = new Date(now.getTime() + 9 * 60 * 60 * 1000);    const selectedTeams = this.getSelectedTeams();
    for (const team of selectedTeams) {
      for (const member of team.member) {
        const match: Match = {
          date: jstString,
          sets: member.sets,
        };
        const targetPlayer = dataList.data.find((data) => data.id === member.id);
        if (targetPlayer) {
          targetPlayer.matches.push(match);
        } else {
          const playData: PlayData = {
            id: member.id,
            matches: [match],
          }
          dataList.data.push(playData);
        }
      }
    }
    localStorage.setItem(DATA, JSON.stringify(dataList));
  }
}
