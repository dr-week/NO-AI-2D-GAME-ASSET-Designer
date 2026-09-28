export type LoadedImage = { url: string; image: HTMLImageElement }

const allowedTypes = new Set(['image/png', 'image/jpeg', 'image/webp'])
const maxFileSize = 25 * 1024 * 1024
const maxDimension = 6000
const maxPixels = 16_000_000

export async function loadImageFile(file: File): Promise<LoadedImage> {
  if (file.size > maxFileSize) throw new Error('Image file must be 25 MB or smaller.')
  if (!allowedTypes.has(file.type)) throw new Error('Choose a PNG, JPEG, or WebP image.')

  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('This image could not be opened.'))
      image.src = url
    })
    if (image.naturalWidth > maxDimension || image.naturalHeight > maxDimension || image.naturalWidth * image.naturalHeight > maxPixels) {
      throw new Error('Image dimensions exceed 6,000 px or 16 MP.')
    }
    return { url, image }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}
