import React from 'react';
import ReactImageMagnify from 'react-image-magnify';

const Zoomer = () => {
  const imageSrc = 'https://mrsmokiestyle.home.blog/wp-content/uploads/2021/03/burka.jpg';

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: 'Burka',
            isFluidWidth: true,
            src: imageSrc,
            // sizes: '(max-width: 768px) 100vw, 500px',
          },
          largeImage: {
            src: imageSrc,
            width: 1200,
            height: 1800,
          },
          enlargedImagePosition: 'beside', // Zoom appears beside image
          enlargedImageContainerDimensions: {
            width: '100%',
            height: '100%',
          },
          isHintEnabled: true,
          shouldUsePositiveSpaceLens: true,
          lensStyle: { backgroundColor: 'rgba(0,0,0,0.2)' },
        }}
      />
    </div>
  );
};

export default Zoomer;
