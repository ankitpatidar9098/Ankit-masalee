import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

// Clear existing data
await connection.execute('DELETE FROM pageContent');
await connection.execute('DELETE FROM products');
await connection.execute('DELETE FROM categories');

// Insert categories
const categoryData = [
  { name: 'Whole Spices', description: 'Premium whole spices for authentic flavor', icon: '🌿' },
  { name: 'Ground Spices', description: 'Finely ground spices ready to use', icon: '✨' },
  { name: 'Spice Blends', description: 'Carefully crafted spice blends', icon: '🎯' },
];

const categoryResults = [];
for (const cat of categoryData) {
  const slug = generateSlug(cat.name);
  const [result] = await connection.execute(
    'INSERT INTO categories (name, description, icon, slug, displayOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [cat.name, cat.description, cat.icon, slug, categoryResults.length]
  );
  categoryResults.push(result.insertId);
}

console.log('✓ Categories created:', categoryResults);

// Insert products
const productData = [
  // Whole Spices
  { categoryId: categoryResults[0], name: 'Black Cardamom', price: 49900, description: 'Smoky and aromatic black cardamom pods', image: 'https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[0], name: 'Cinnamon Sticks', price: 34900, description: 'Premium Ceylon cinnamon sticks', image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[0], name: 'Star Anise', price: 29900, description: 'Whole star anise for authentic Asian cuisine', image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[0], name: 'Cloves', price: 59900, description: 'Whole cloves with intense aroma', image: 'https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=500&h=500&fit=crop' },
  
  // Ground Spices
  { categoryId: categoryResults[1], name: 'Turmeric Powder', price: 19900, description: 'Pure turmeric powder with high curcumin content', image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[1], name: 'Cumin Powder', price: 24900, description: 'Freshly ground cumin powder', image: 'https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[1], name: 'Coriander Powder', price: 22900, description: 'Aromatic coriander powder', image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[1], name: 'Red Chili Powder', price: 17900, description: 'Spicy red chili powder', image: 'https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=500&h=500&fit=crop' },
  
  // Spice Blends
  { categoryId: categoryResults[2], name: 'Garam Masala', price: 34900, description: 'Traditional garam masala blend', image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64b73?w=500&h=500&fit=crop' },
  { categoryId: categoryResults[2], name: 'Chai Masala', price: 29900, description: 'Perfect blend for chai tea', image: 'https://images.unsplash.com/photo-1596040708502-c3f5f0f3c0d0?w=500&h=500&fit=crop' },
];

let productCount = 0;
for (const prod of productData) {
  const sku = `SKU-${generateSlug(prod.name)}-${Date.now()}`.substring(0, 100);
  await connection.execute(
    'INSERT INTO products (categoryId, name, description, price, sku, image, stock, isActive, displayOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [prod.categoryId, prod.name, prod.description, prod.price, sku, prod.image, 100, 1, productCount]
  );
  productCount++;
}

console.log(`✓ Products created: ${productCount}`);

// Insert page content
const pageContentData = [
  { 
    sectionKey: 'hero', 
    title: 'Premium Spices for Every Kitchen',
    subtitle: 'Authentic flavors, carefully sourced and packaged',
    description: 'Discover our premium collection of spices',
    buttonText: 'Explore Our Collection',
    buttonLink: '#whole-spices'
  },
  {
    sectionKey: 'whole_spices',
    title: 'Whole Spices',
    subtitle: 'Quality Kitchen Spices - Authentic & Fresh',
    description: 'Our premium collection of whole spices',
    buttonText: 'View All',
    buttonLink: '#products'
  },
  {
    sectionKey: 'ground_spices',
    title: 'Ground Spices',
    subtitle: 'Ready to use, perfectly ground',
    description: 'Our ground spices are freshly prepared',
    buttonText: 'Shop Now',
    buttonLink: '#products'
  },
  {
    sectionKey: 'inspiration',
    title: 'Culinary Inspiration',
    subtitle: 'Learn how to use our spices',
    description: 'Explore recipes and cooking tips',
    buttonText: 'Get Inspired',
    buttonLink: '#recipes'
  },
];

let contentCount = 0;
for (const content of pageContentData) {
  await connection.execute(
    'INSERT INTO pageContent (sectionKey, title, subtitle, description, buttonText, buttonLink, displayOrder, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [content.sectionKey, content.title, content.subtitle, content.description, content.buttonText, content.buttonLink, contentCount, 1]
  );
  contentCount++;
}

console.log(`✓ Page content created: ${contentCount}`);

await connection.end();
console.log('\n✅ Database seeded successfully!');
