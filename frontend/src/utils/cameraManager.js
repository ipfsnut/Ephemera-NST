let videoStream = null;
let videoElement = null;

export const initializeCamera = async () => {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement = document.createElement('video');
    videoElement.srcObject = videoStream;
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
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    
    console.log('Converting canvas to blob');
    canvas.toBlob(blob => {
      if (blob) {
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
  const imageBlob = await captureImage();
  console.log('Image captured, blob size:', imageBlob.size);
  return imageBlob;
};

export const shutdownCamera = () => {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }
  videoElement = null;
};
