import { saveTrialWithImage as saveTrialDataWithImage } from './indexedDB';

// Global variables to store video stream and video element
let videoStream = null;
let videoElement = null;

export const initializeCamera = async () => {
  try {
    // Request access to the user's camera
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    // Create a video element to display the camera feed
    videoElement = document.createElement('video');
    // Set the video element's source to the camera stream
    videoElement.srcObject = videoStream;
    // Start playing the video (necessary for capturing frames)
    await videoElement.play();
    return true;
  } catch (error) {
    console.error('Camera initialization failed:', error);
    return false;
  }
};

export const captureImage = () => {
  console.log('captureImage function called');
  return new Promise((resolve, reject) => {
    if (!videoElement) {
      console.error('Camera not initialized');
      reject(new Error('Camera not initialized'));
      return;
    }

    console.log('Creating canvas for image capture');
    // Create a canvas element to draw the current video frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    // Draw the current video frame onto the canvas
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    
    console.log('Converting canvas to blob');
    // Convert the canvas content to a Blob (binary large object)
    canvas.toBlob(blob => {
      if (blob) {
        // If successful, log the blob size and resolve the promise with the blob
        console.log('Image captured successfully, blob size:', blob.size);
        resolve(blob);
      } else {
        console.error('Failed to create image blob');
        reject(new Error('Failed to create image blob'));
      }
    }, 'image/jpeg');
  });
};

export const queueCapture = async () => {
  console.log('Queuing image capture...');
  // Capture an image and store it as a blob
  const imageBlob = await captureImage();
  console.log('Image captured, blob size:', imageBlob.size);
  // Return the image blob for further processing or storage
  return imageBlob;
};

export const captureAndSaveImage = async (trialId) => {
  try {
    // Capture an image and get it as a blob
    const imageBlob = await captureImage();
    // Save the image blob along with the trial data in IndexedDB
    await saveTrialDataWithImage(trialId, imageBlob);
    console.log('Image captured and saved successfully for trial:', trialId);
    // Return the image blob for potential further use
    return imageBlob;
  } catch (error) {
    console.error('Error capturing and saving image:', error);
    throw error;
  }
};

export const shutdownCamera = () => {
  if (videoStream) {
    // Stop all tracks in the video stream
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  // Clear the video element reference
  videoElement = null;
};
