import Got from 'got';

import { Category, CategoryDTO } from '../types';
import Config from '../utils/Config';
import { Logger } from '../utils/Logger';

class CategoryService {
  private categoryData: Category[] = [];

  async requestCategories(): Promise<void> {
    try {
      Logger.info('Reading category data from magento');
      const response = await Got(`${Config.magentouri}/index.php/rest/V1/categories`, {
        headers: {
          Authorization: `Bearer ${Config.token}`
        }
      });
      const rawCategoryData = JSON.parse(response.body);

      // Ignore first category level, but parse in the rest
      const catData = this.parseCategoryData(rawCategoryData.children_data, 0);
      this.categoryData = catData;
    } catch(err) {
      console.log(err);
    }
  }

  parseCategoryData(child_data: CategoryDTO[], parentId: number): Category[] {
    if(!child_data || !Array.isArray(child_data) || child_data.length === 0) {
      return [];
    }

    const newCats: Category[] = [];
    child_data.forEach( (cat) => {
      newCats.push({
        id: cat.id,
        name: cat.name,
        is_active: cat.is_active,
        parent_id: parentId
      });

      this
        .parseCategoryData( cat.children_data, cat.id )
        .forEach( (subCat) => newCats.push(subCat) );
    });

    return newCats;
  }

}

export default CategoryService;