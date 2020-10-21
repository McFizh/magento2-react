import Got from 'got';
import Config from '../utils/Config';

class CategoryService {
  async requestCategories(): Promise<void> {
    try {
      const response = await Got(`${Config.magentouri}/index.php/rest/V1/categories`);
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }
}

export default CategoryService;