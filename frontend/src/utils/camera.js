export const takePicture = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          const imageCapture = new ImageCapture(track);
  
          imageCapture.takePhoto()
            .then(blob => {
              track.stop();
              resolve(blob);
            })
            .catch(error => {
              track.stop();
              reject(error);
            });
        })
        .catch(reject);
    });
  };