import { toPng } from 'html-to-image';

/**
 * Captures an HTML element and downloads it as a sharp PNG image
 */
export async function downloadElementAsPng(element: HTMLElement, filename: string): Promise<void> {
  try {
    // 2x pixel ratio ensures crisp typography on high-DPI screens
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      filter: (node) => {
        // Exclude elements with the no-print class if any are nested
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      },
    });

    // Create a temporary link to trigger browser download
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Failed to export invoice as PNG:', error);
    throw error;
  }
}