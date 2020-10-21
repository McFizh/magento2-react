import App from './App';

import CategoryRouter from './controllers/CategoryRouter';

import CategoryService from './services/CategoryService';

const app = new App(3000, [
  new CategoryRouter()
]);

const catService = new CategoryService();
catService.requestCategories();

app.listen();