import db from '../database/connection.js';

async function getEnhanceableItems() {
    try {
        const items = await db('enhanceable_items').select(
            'id',
            'name as text',
            'icon_path as icon',
            'color_hex as colorClass' 
        );
        return items;
    } catch (error) {
        console.error('Database error in getEnhanceableItems:', error);
        throw new Error('Error fetching enhanceable items');
    }
}

async function getEnhanceableItemById(id) {
    try {
        const item = await db('enhanceable_items').where({ id }).first();
        return item;
    } catch (error) {
        console.error(`Database error fetching item by ID ${id}:`, error);
        throw new Error('Error fetching enhanceable item');
    }
}

export { getEnhanceableItems, getEnhanceableItemById };
