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
  return new Promise((resolve, reject) => {
    if (!videoElement) {
      reject(new Error('Camera not initialized'));
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    canvas.getContext('2d').drawImage(videoElement, 0, 0);
    
    canvas.toBlob(resolve, 'image/jpeg');
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