'use client'; // This directive marks it as a Client Component

import Image from 'next/image';

// This is our custom loader function, now living inside the client component file
const payloadImageLoader = ({ src, width, quality }) => {
  // The `src` prop will be the relative URL from Payload (e.g., /media/image.jpg)
  // We prepend our backend's public URL.
  return `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${src}?w=${width}&q=${quality || 75}`;
};

// This is the actual component we will use in our pages
export const PayloadImage = ({ src, alt, width, height, priority, className }) => {
  if (!src) {
    return <span>No Image</span>;
  }

  return (
    <Image
      loader={payloadImageLoader}
      src={src}
      alt={alt || 'Image'}
      width={width}
      height={height}
      priority={priority}
      className={className}
    />
  );
};