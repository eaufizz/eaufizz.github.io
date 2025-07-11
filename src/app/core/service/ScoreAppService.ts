import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

const PLAYERS = "players";

export interface Team {
  name: string;
  member: Player[];
  score: number;
  totalScore: number;
  miss: number;
  currentPlayer: Player,
}

export interface Player {
  name: string;
  id: string;
  order?: number;
}

export interface SnapShot {
  teams: Team[];
  activeTeam: Team;
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
    const guest: Player = {
      name: "ゲスト", id: "guest"
    };
    const players: Player[] = stored ? JSON.parse(stored) : [];
    players.unshift(guest);
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
    localStorage.setItem(PLAYERS, JSON.stringify(noGuest));
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
}
