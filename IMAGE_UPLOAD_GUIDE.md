# Image Upload Feature Guide

## Overview

The Quality Kitchen Spices admin dashboard now includes a complete image upload system with drag-and-drop support. You can upload product images, category icons, and page content images directly from the admin interface.

## Features

### Drag-and-Drop Upload
- Simply drag image files onto the upload area
- Or click to select files from your computer
- Real-time preview of selected images
- Progress indicator during upload

### File Type Support

**Product Images:**
- Supported formats: JPEG, PNG, WebP, GIF
- Maximum file size: 5MB
- Recommended resolution: 800x800px or higher
- Best for: Product showcase photos

**Category Icons:**
- Supported formats: JPEG, PNG, WebP, SVG
- Maximum file size: 2MB
- Recommended resolution: 200x200px
- Best for: Category badges and icons

**Page Content Images:**
- Supported formats: JPEG, PNG, WebP
- Maximum file size: 10MB
- Recommended resolution: 1920x1080px or higher
- Best for: Hero sections and banner images

## How to Use

### Uploading a Product Image

1. Go to the **Admin Dashboard** → **Products** tab
2. Click **Add Product** button
3. Fill in product details (name, price, category, etc.)
4. Scroll to the **Product Image** section
5. Drag and drop an image or click **Select Image**
6. Wait for upload confirmation (green checkmark)
7. Click **Create Product** to save

### Uploading a Category Icon

1. Go to **Admin Dashboard** → **Categories** tab
2. Click **Add Category** button
3. Fill in category details (name, slug, description)
4. The icon field accepts emoji by default
5. Click **Create Category** to save

### Uploading Page Content Image

1. Go to **Admin Dashboard** → **Page Content** tab
2. Click **Add Section** button
3. Fill in section details (title, description, etc.)
4. Scroll to the **Section Image** section
5. Drag and drop an image or click **Select Image**
6. Wait for upload confirmation
7. Click **Create Section** to save

## Image Upload Process

### Step-by-Step Flow

```
1. Select/Drag Image
   ↓
2. Validate File Type
   ↓
3. Validate File Size
   ↓
4. Show Preview
   ↓
5. Upload to S3
   ↓
6. Get CDN URL
   ↓
7. Display Success
   ↓
8. Save URL to Database
```

### Upload Endpoints

All image uploads go through the following tRPC endpoints:

```
POST /api/trpc/upload.productImage.mutate
POST /api/trpc/upload.categoryIcon.mutate
POST /api/trpc/upload.pageContentImage.mutate
```

## Technical Details

### Image Upload Component

The `ImageUpload` component is located at:
```
client/src/components/ImageUpload.tsx
```

**Props:**
- `onImageUpload` (required): Callback function that receives the uploaded image URL
- `uploadType` (optional): Type of upload - "product", "category", or "content"
- `maxSize` (optional): Maximum file size in MB (default varies by type)
- `preview` (optional): Show image preview (default: true)

**Example Usage:**
```tsx
<ImageUpload
  onImageUpload={(url) => setFormData({ ...formData, image: url })}
  uploadType="product"
  maxSize={5}
/>
```

### Upload Router

The upload API is defined in:
```
server/routers/upload.ts
```

**Features:**
- Admin-only access control
- File type validation
- File size validation
- Automatic filename generation with nanoid
- S3 storage integration
- Error handling and user feedback

### Database Storage

Images are stored in S3 with the following structure:

```
products/
  ├── {nanoid}-{timestamp}.jpg
  ├── {nanoid}-{timestamp}.png
  └── ...

categories/
  ├── {nanoid}-{timestamp}.png
  └── ...

content/
  ├── {nanoid}-{timestamp}.jpg
  └── ...
```

The image URLs are stored in the database:
- `products.image` - Product image URL
- `pageContent.image` - Page content image URL

## Error Handling

### Common Errors

**"Invalid file type"**
- Solution: Use supported image formats (JPEG, PNG, WebP, GIF)
- Check file extension and MIME type

**"File size exceeds limit"**
- Solution: Compress image or use smaller file
- Use online tools like TinyPNG or ImageOptim

**"Upload failed"**
- Solution: Check internet connection
- Try uploading again
- Check browser console for detailed error

**"Admin access required"**
- Solution: Ensure you're logged in as admin
- Contact site owner to promote your account

## Best Practices

### Image Optimization

1. **Compress images before uploading**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Reduces file size without quality loss

2. **Use appropriate formats**
   - JPEG for photos (smaller file size)
   - PNG for graphics with transparency
   - WebP for modern browsers (best compression)

3. **Recommended dimensions**
   - Product images: 800x800px or 1200x1200px
   - Category icons: 200x200px or 300x300px
   - Hero images: 1920x1080px or 2560x1440px

4. **Naming convention**
   - Use descriptive names: "turmeric-powder-product.jpg"
   - Avoid special characters and spaces
   - Keep names under 50 characters

### Upload Tips

1. **Batch uploads**
   - Upload one image at a time
   - Wait for confirmation before uploading next

2. **Verify uploads**
   - Check that images appear correctly on the website
   - Test on mobile and desktop browsers

3. **Keep backups**
   - Maintain original image files
   - Store in cloud backup (Google Drive, Dropbox, etc.)

## Troubleshooting

### Image not showing after upload

**Possible causes:**
1. Image URL not saved to database
2. CDN cache issue
3. Incorrect image path

**Solutions:**
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache
- Check browser console for errors
- Re-upload the image

### Upload stuck or slow

**Possible causes:**
1. Large file size
2. Slow internet connection
3. Server issue

**Solutions:**
- Compress image to smaller size
- Check internet speed
- Try uploading from different network
- Contact support if issue persists

### File type rejected

**Possible causes:**
1. Unsupported format
2. Incorrect MIME type
3. Corrupted file

**Solutions:**
- Convert to supported format (JPEG, PNG, WebP)
- Use online converter tool
- Re-download the image file
- Try different image file

## API Reference

### Upload Product Image

```typescript
const result = await trpc.upload.productImage.mutate({
  file: imageFile,
  productId: 123 // optional
});

// Returns:
{
  success: true,
  url: "https://cdn.example.com/products/abc123-1234567890.jpg",
  key: "products/abc123-1234567890.jpg",
  filename: "turmeric.jpg",
  size: 204800,
  type: "image/jpeg"
}
```

### Upload Category Icon

```typescript
const result = await trpc.upload.categoryIcon.mutate({
  file: iconFile
});

// Returns:
{
  success: true,
  url: "https://cdn.example.com/categories/xyz789-1234567890.png",
  key: "categories/xyz789-1234567890.png",
  filename: "icon.png"
}
```

### Upload Page Content Image

```typescript
const result = await trpc.upload.pageContentImage.mutate({
  file: contentFile
});

// Returns:
{
  success: true,
  url: "https://cdn.example.com/content/def456-1234567890.jpg",
  key: "content/def456-1234567890.jpg",
  filename: "hero-banner.jpg"
}
```

## Testing

The image upload functionality includes comprehensive tests:

```bash
# Run upload tests
pnpm test -- upload.test.ts

# Run all tests
pnpm test
```

**Test coverage:**
- Authorization (admin-only access)
- File type validation
- File size validation
- Error handling
- Success responses

## Future Enhancements

- [ ] Batch image upload
- [ ] Image cropping/editing
- [ ] Automatic image optimization
- [ ] Image gallery management
- [ ] Drag-to-reorder images
- [ ] Image metadata editing
- [ ] WebP conversion
- [ ] Thumbnail generation

## Support

For issues or questions about image uploads:

1. Check this guide first
2. Review browser console for errors
3. Check server logs
4. Contact development team

## Security

- **Admin-only access**: Only authenticated admins can upload
- **File type validation**: Only image formats allowed
- **File size limits**: Prevents abuse and large uploads
- **Secure storage**: Images stored in S3 with proper permissions
- **CDN delivery**: Images served through CDN for security and performance
