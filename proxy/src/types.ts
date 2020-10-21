import * as Express from 'express';

export interface ControllerInterface {
  router: Express.Router;
}