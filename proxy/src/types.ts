import * as Express from 'express';

export interface ControllerInterface {
  router: Express.Router;
}

export type CategoryDTO = {
  id: number;
  name: string;
  parent_id: number;
  is_active: boolean;
  children_data: CategoryDTO[]
}

export type Category = {
  id: number;
  name: string;
  parent_id: number;
  is_active: boolean;
}