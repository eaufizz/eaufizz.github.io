import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// IndexedDB 設定
const DB_NAME = 'ScoreAppDB';
const DB_VERSION = 1;
const STORE_PLAYERS = 'players';
const STORE_DATA = 'data';

export interface Team {
  name: string;
  member: Player[];
  score: number;
  totalScore: number;
  miss: number;
  currentPlayer: Player;
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
  private db!: IDBDatabase;
  private teamCount: number = 0;
  private setCount: number = 0;
  private snapShot: SnapShot[] = [];
  private selectedTeams = new BehaviorSubject<Team[]>([]);
  private registeredPlayer = new BehaviorSubject<Player[]>([]);

  private selectedTeams$ = this.selectedTeams.asObservable();
  private registeredPlayer$ = this.registeredPlayer.asObservable();

  constructor() {
    this.initDB().then(() => this.loadPlayers());
  }

  // ===============================
  // IndexedDB 初期化
  // ===============================
  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result as IDBDatabase;
        if (!db.objectStoreNames.contains(STORE_PLAYERS)) {
          db.createObjectStore(STORE_PLAYERS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_DATA)) {
          db.createObjectStore(STORE_DATA, { keyPath: 'id' });
        }
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve();
      };

      request.onerror = (event: any) => {
        console.error('IndexedDB open error:', event);
        reject(event);
      };
    });
  }

  private transaction(storeName: string, mode: IDBTransactionMode = 'readonly') {
    const tx = this.db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);
    return { tx, store };
  }

  private getAllFromStore<T>(storeName: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const { store } = this.transaction(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = (e) => reject(e);
    });
  }

  private putToStore<T>(storeName: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      const { store } = this.transaction(storeName, 'readwrite');
      const request = store.put(value);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e);
    });
  }

  private deleteFromStore(storeName: string, key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const { store } = this.transaction(storeName, 'readwrite');
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e);
    });
  }

  // ===============================
  // プレイヤー管理
  // ===============================
  private async loadPlayers() {
    const guest: User = { name: 'ゲスト', id: 'guest' };
    const users = await this.getAllFromStore<User>(STORE_PLAYERS);
    users.unshift(guest);
    const players = users.map((user) => ({
      ...user,
      sets: [],
    }));
    this.registeredPlayer.next(players);
  }

  async updateRegisteredPlayer(players: Player[]): Promise<void> {
    const noGuest = players.filter((p) => p.id !== 'guest');
    const tx = this.db.transaction(STORE_PLAYERS, 'readwrite');
    const store = tx.objectStore(STORE_PLAYERS);
    store.clear(); // 全削除して再登録
    for (const player of noGuest) {
      const user = { name: player.name, id: player.id };
      store.put(user);
    }
    await new Promise((res) => (tx.oncomplete = res));
    this.registeredPlayer.next(players);
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
    if (this.isDuplicatePlayer(playerName)) return;
    const newPlayer: Player = {
      name: playerName,
      id: uuidv4(),
      sets: [],
    };
    this.addRegisteredPlayer(newPlayer);
  }

  isDuplicatePlayer(playerName: string): boolean {
    return (
      this.getRegisteredPlayer().find((p) => p.name === playerName) !==
      undefined
    );
  }

  getPlayerFromID(id: string): Player | undefined {
    return this.registeredPlayer.value.find((p) => p.id === id);
  }

  async saveCurrentTeamData(monthOffset: number = 0): Promise<void> {
    const selectedTeams = this.getSelectedTeams();
    const now = new Date();
    const jstDate = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    jstDate.setMonth(jstDate.getMonth() + monthOffset);

    for (const team of selectedTeams) {
      for (const member of team.member) {
        const match: Match = { date: jstDate, sets: member.sets };

        const existing = await this.getDataFromID(member.id);
        if (existing) {
          existing.matches.push(match);
          await this.putToStore(STORE_DATA, existing);
        } else {
          const newData: PlayData = { id: member.id, matches: [match] };
          await this.putToStore(STORE_DATA, newData);
        }
      }
    }
  }

  async getDataFromID(id: string): Promise<PlayData | undefined> {
    return new Promise((resolve, reject) => {
      const { store } = this.transaction(STORE_DATA);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as PlayData);
      request.onerror = (e) => reject(e);
    });
  }

  // ===============================
  // チーム・スナップショット管理
  // ===============================
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
}
