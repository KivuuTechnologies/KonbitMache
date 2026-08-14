/**
 * Client-side utility to resize and compress image files before uploading
 * Reduces bandwidth usage on slow mobile networks
 */
export async function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // If it is not an image - reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported - fallback to JPEG
        const outputMime = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              // Fallback to JPEG
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) resolve(jpegBlob);
                  else reject(new Error('Canvas to Blob conversion failed'));
                },
                'image/jpeg',
                quality
              );
            }
          },
          outputMime,
          quality
        );
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error('Empty file reader result'));
      }
    };

    reader.readAsDataURL(file);
  });
}
