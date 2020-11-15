import App from './App';

import { readConfigJson } from './utils/Config';
import CategoryRouter from './controllers/CategoryRouter';
import CategoryService from './services/CategoryService';

// Read config.json file created by magento migration scripts
readConfigJson();

const app = new App(3000, [
  new CategoryRouter()
]);

const catService = new CategoryService();
catService.requestCategories();

app.listen();