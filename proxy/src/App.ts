import * as Express from 'express';

import { ControllerInterface } from './types';
import { Logger } from './utils/Logger';
import { initDb } from './utils/Database';

class App {
  public express: Express.Application;
  private port: number;

  constructor(port: number, controllers: ControllerInterface[]) {
    this.express = Express();
    this.port = port;

    initDb();

    controllers.forEach( (controller) => {
      this.express.use('/api', controller.router);
    });
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      Logger.info(`Backend running on port ${this.port}`);
    });
  }
}

export default App;