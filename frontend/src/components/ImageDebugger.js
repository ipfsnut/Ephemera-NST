import React from 'react';

const ImageDebugger = ({ imageBlob }) => {
  if (!imageBlob) return null;

  const imageUrl = URL.createObjectURL(imageBlob);

  return (
    <div className="image-debugger">
      <img src={imageUrl} alt="Captured" style={{ maxWidth: '200px' }} />
    </div>
  );
};

export default ImageDebugger;
