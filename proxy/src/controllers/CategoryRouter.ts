import * as Express from 'express';

import { ControllerInterface } from '../types';

class CategoryRouter implements ControllerInterface {
  public router;

  constructor() {
    this.router = Express.Router();
    this.router.get('/categories', this.getRouteHandler);
  }

  private async getRouteHandler(req: Express.Request, rsp: Express.Response): Promise<void> {
    rsp.status(200).send([]);
  }

}

export default CategoryRouter;