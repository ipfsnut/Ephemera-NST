import { captureImage } from './cameraManager';

export const captureAndProcessImage = async () => {
  try {
    return await captureImage();
  } catch (error) {
    console.error('Error capturing image:', error);
    return null;
  }
};

export const getImageFileName = (trialNumber, responseIndex) => {
  return `Trial_${trialNumber}_Response_${responseIndex}.jpg`;
};
