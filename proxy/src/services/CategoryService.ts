import Got from 'got';

import { Category, CategoryDTO } from '../types';
import Config from '../utils/Config';

const ApiConfig = require('../../../shared/config.js');

class CategoryService {
  private categoryData: Category[] = [];

  async requestCategories(): Promise<void> {
    try {
      const response = await Got(`${Config.magentouri}/index.php/rest/V1/categories`, {
        headers: {
          Authorization: `Bearer ${ApiConfig.token}`
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
    for(const cat of child_data) {
      newCats.push({
        id: cat.id,
        name: cat.name,
        is_active: cat.is_active,
        parent_id: parentId
      });

      this
        .parseCategoryData( cat.children_data, cat.id )
        .forEach( (subCat) => newCats.push(subCat) );
    }


    return newCats;
  }

}

export default CategoryService;