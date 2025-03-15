/**
 * @fileOverview This file contains the implementation of a utility function `convertToBase64` that converts an image file
 * into a Base64-encoded string. The function reads the provided image file, crops it to a square based on its smaller
 * dimension, and uses a canvas element to produce the Base64-encoded representation. It employs a Promise-based structure 
 * for asynchronous processing, ensuring proper error handling during file reading and image manipulation. This utility is 
 * particularly useful for scenarios where image data needs to be transferred or stored in Base64 format.
 */

/**
 * Converts an image file into a Base64-encoded string.
 *
 * This function reads an image file, crops it to a square based on the smaller dimension, 
 * and converts the resulting image into a Base64 string using a canvas element.
 *
 * @function
 * @param {File} file - The image file to be converted.
 * @returns {Promise<string>} A Promise that resolves to the Base64-encoded string of the cropped image.
 */
export default function convertToBase64(file) {
    /**
     * Reference: https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise
     */
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        // Make an image square by cropping the smaller side
        const image = new Image();
        image.src = fileReader.result;
  
        image.onload = () => {
          const size = Math.min(image.width, image.height);
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const context = canvas.getContext('2d');
          context.drawImage(
            image,
            (image.width - size) / 2,
            (image.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );
          // Use canvas.toDataURL to obtain the URL of the cropped image
          resolve(canvas.toDataURL('image/jpeg'));
        };
      };
  
      fileReader.onerror = (error) => {
        reject(error); // Reject the promise if there's an error reading the file
      };
    });
  }
  