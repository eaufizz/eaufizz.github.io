import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent {
  isLoading: boolean = false;
  title = 'frontend';
  urls: string[] = [
    "assets/images/header_wood.svg",
    "assets/images/start_game.svg",
    "assets/images/title.svg",
    "assets/images/view_graph.svg",
    "assets/icon/back-button.svg",
    "assets/icon/home-button.svg",
  ];

  ngOnInit(): void {
    this.preloadImages(this.urls);
  }

  preloadImages(urls: string[]): void {
    this.isLoading = true;
    const Promises = urls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });
    });
    Promise.allSettled(Promises).then(() => {
      this.isLoading = false;
    })
  };
}
