import { enableProdMode } from '@angular/core';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './app/app.server.module';
import { readFileSync } from 'fs';  // 追加
import { join } from 'path';  // 追加

enableProdMode();

const template = readFileSync(join(new URL('.', import.meta.url).pathname, 'browser', 'index.html'), 'utf-8');

const serverRender = renderModule(AppServerModule, {
  document: template,
  url: '/'
}).then(html => {
  console.log(html);
});

export default serverRender;  // 追加
