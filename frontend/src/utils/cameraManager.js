let stream = null;
let imageCapture = null;
const captureQueue = [];
let isProcessing = false;

export const initializeCamera = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
  const track = stream.getVideoTracks()[0];
  imageCapture = new ImageCapture(track);
};

export const queueCapture = () => {
  return new Promise((resolve, reject) => {
    captureQueue.push({ resolve, reject });
    processQueue();
  });
};

const processQueue = async () => {
  if (isProcessing || captureQueue.length === 0) return;
  isProcessing = true;

  const { resolve, reject } = captureQueue.shift();
  try {
    const blob = await imageCapture.takePhoto();
    resolve(blob);
  } catch (error) {
    reject(error);
  } finally {
    isProcessing = false;
    processQueue();
  }
};

export const shutdownCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  stream = null;
  imageCapture = null;
};