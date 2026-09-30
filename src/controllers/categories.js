//Import
import { getAllCategories } from '../models/categories.js';

//Functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    
    res.render('categories', { title, categories });
};

//Export
export { showCategoriesPage };
