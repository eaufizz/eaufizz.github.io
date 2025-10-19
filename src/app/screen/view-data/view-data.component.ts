import { Component } from '@angular/core';
import {
  Router,
  ActivatedRoute,
} from '@angular/router'
import { PlayData, Player, ScoreAppService, SetData } from '../../core/service/ScoreAppService';

interface ChartData {
  name: string;
  series: Series[];
}

interface Series {
  name: string;
  value: string;
}
@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.scss',
  standalone: false,
})
export class ViewDataComponent {
  targetName: string = ""
  setWinRate: number = 0;
  averageWinningTurns: number = 0;
  averageBreaks: number = 0;
  averageCriticalRate: number = 0;
  averageScore: number = 0;
  foulRate: number = 0;
  overFiftyRate: number = 0;
  dropoutRate: number = 0;

  chartFilter: string[] = [];
  filteredChart: ChartData[] = [];

  chartData: ChartData[] = [
    {
      name: "セット勝率",
      series: [],
    },
    {
      name: "勝利ターン平均",
      series: [],
    },
    {
      name: "ブレイク平均",
      series: [],
    },
    {
      name: "狙い通り率",
      series: [],
    },
    {
      name: "平均得点",
      series: [],
    },
    {
      name: "ファウル率",
      series: [],
    },
    {
      name: "50オーバー",
      series: [],
    },
    {
      name: "セット失格率",
      series: [],
    },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scoreAppService: ScoreAppService,
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get("id");
    if (id !== null) {
      const player = this.scoreAppService.getPlayerFromID(id);
      if (player) {
        this.targetName = player.name;
      }
      const data = await this.scoreAppService.getDataFromID(id);
      if (data) {
        this.calculateData(data);
        const monthlyData = this.calculateMonthlyTrends(data);
        this.setChartDataFromMonthlyTrends(monthlyData);
      }
    }
    console.log(this.chartData);
  }

  calculateData(data: PlayData): void {
    let setCount: number = 0;
    let winCount: number = 0;
    let winningTurn: number = 0;
    let breakCount: number = 0;
    let breakScore: number = 0;
    let criticalCount: number = 0;
    let throwCount: number = 0;
    let foulRate: number = 0;
    let totalScore: number = 0;
    let overCount: number = 0;
    let dropoutCount: number = 0;

    for (const match of data.matches) {
      for (const set of match.sets) {
        setCount++;
        if (set.win) {
          winCount++;
          winningTurn += set.turn;
        }
        if (set.break >= 0) {
          breakCount++;
          breakScore += set.break;
        }
        if (set.dropout) {
          dropoutCount++;
        }
        criticalCount += set.critical;
        throwCount += set.throws.length;
        overCount += set.over;
        for (const score of set.throws) {
          if (score === 0) {
            foulRate++;
          } else {
            totalScore += score;
          }
        }
      }
    }

    if (winCount > 0 && setCount > 0) {
      this.setWinRate = Math.round(winCount / setCount * 10000) / 100;
    }
    if (winCount > 0 && winningTurn > 0) {
      this.averageWinningTurns = Math.round(winningTurn / winCount * 100) / 100;
    }
    if (breakCount > 0 && breakScore > 0) {
      this.averageBreaks = Math.round(breakScore / breakCount * 100) / 100;
    }
    if (criticalCount > 0 && throwCount > 0) {
      this.averageCriticalRate = Math.round(criticalCount / throwCount * 10000) / 100;
    }
    if (throwCount > 0 && totalScore > 0) {
      this.averageScore = Math.round(totalScore / throwCount * 100) / 100;
    }
    if (foulRate > 0 && throwCount > 0) {
      this.foulRate = Math.round(foulRate / throwCount * 10000) / 100;
    }
    if (overCount > 0 && setCount > 0) {
      this.overFiftyRate = Math.round(overCount / setCount * 100) / 100;
    }
    if (dropoutCount > 0 && setCount > 0) {
      this.dropoutRate = Math.round(dropoutCount / setCount * 10000) / 100;
    }
  }

calculateMonthlyTrends(data: PlayData): any[] {
  const monthlySetsMap = new Map<string, SetData[]>();

  for (const match of data.matches) {
    const date = new Date(match.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // 'YYYY-MM'
    if (!monthlySetsMap.has(key)) {
      monthlySetsMap.set(key, []);
    }
    monthlySetsMap.get(key)!.push(...match.sets);
  }

  type TrendSeries = { name: string; value: number };

  const result: { [key: string]: TrendSeries[] } = {
    setWinRate: [],
    averageWinningTurns: [],
    averageBreaks: [],
    averageCriticalRate: [],
    averageScore: [],
    foulRate: [],
    overFiftyRate: [],
    dropoutRate: []
  };

  // ⏱ 累積セットを保持する
  let cumulativeSets: SetData[] = [];

  // 📅 月の昇順で処理
  const sortedMonths = [...monthlySetsMap.keys()].sort();

  for (const month of sortedMonths) {
    const sets = monthlySetsMap.get(month)!;
    cumulativeSets.push(...sets);  // 累積に追加

    // 同じ集計処理
    let setCount = 0, winCount = 0, winningTurn = 0;
    let breakCount = 0, breakScore = 0;
    let criticalCount = 0, throwCount = 0, foulCount = 0;
    let totalScore = 0, overCount = 0, dropoutCount = 0;

    for (const set of cumulativeSets) {
      setCount++;
      if (set.win) {
        winCount++;
        winningTurn += set.turn;
      }
      if (set.break >= 0) {
        breakCount++;
        breakScore += set.break;
      }
      if (set.dropout) dropoutCount++;
      criticalCount += set.critical;
      throwCount += set.throws.length;
      overCount += set.over;
      for (const score of set.throws) {
        if (score === 0) {
          foulCount++;
        } else {
          totalScore += score;
        }
      }
    }

    const pushValue = (key: keyof typeof result, val: number | null) => {
      result[key].push({ name: month, value: val ?? 0 });
    };

    pushValue("setWinRate", setCount ? Math.round((winCount / setCount) * 10000) / 100 : null);
    pushValue("averageWinningTurns", winCount ? Math.round((winningTurn / winCount) * 100) / 100 : null);
    pushValue("averageBreaks", breakCount ? Math.round((breakScore / breakCount) * 100) / 100 : null);
    pushValue("averageCriticalRate", throwCount ? Math.round((criticalCount / throwCount) * 10000) / 100 : null);
    pushValue("averageScore", throwCount ? Math.round((totalScore / throwCount) * 100) / 100 : null);
    pushValue("foulRate", throwCount ? Math.round((foulCount / throwCount) * 10000) / 100 : null);
    pushValue("overFiftyRate", setCount ? Math.round((overCount / setCount) * 100) / 100 : null);
    pushValue("dropoutRate", setCount ? Math.round((dropoutCount / setCount) * 10000) / 100 : null);
  }

  return Object.entries(result).map(([key, series]) => ({
    name: key,
    series
  }));
}


setChartDataFromMonthlyTrends(monthlyData: any[]): void {
  const nameMap: { [key: string]: string } = {
    setWinRate: "セット勝率",
    averageWinningTurns: "勝利ターン平均",
    averageBreaks: "ブレイク平均",
    averageCriticalRate: "狙い通り率",
    averageScore: "平均得点",
    foulRate: "ファウル率",
    overFiftyRate: "50オーバー",
    dropoutRate: "セット失格率"
  };

  for (const entry of monthlyData) {
    const displayName = nameMap[entry.name];
    const target = this.chartData.find((c) => c.name === displayName);
    if (target) {
      target.series = entry.series;
    }
  }
}


  moveToHome(): void {
    this.router.navigate(['']);
  }

  moveToBack(): void {
    this.router.navigate(['view-data']);
  }

  setTeamCount(value: number): void {
    this.scoreAppService.setTeamCount(value);
    this.router.navigate(["set-member"]);
    this.scoreAppService.setSelectedTeams([])
  }

  onClickCard(item: string): void {
    if (this.chartFilter.includes(item)) {
      this.chartFilter = this.chartFilter.filter(
        (filter) => filter !== item
      );
    } else {
      this.chartFilter.push(item);
    }
    this.filterChart()
    console.log(this.chartFilter)
  }

  filterChart(): void {
    this.filteredChart = [];
    for (const filter of this.chartFilter) {
      const targetData = this.chartData.find(
        (data) => data.name === filter
      )
      if (targetData) {
        this.filteredChart.push(targetData);
      }
    }
  }
}
