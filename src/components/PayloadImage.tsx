'use client';

import Image from 'next/image';

type Props = {
  src: string | null | undefined; // The URL from Payload, like /media/image.jpg
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
};

export const PayloadImage = ({ src, alt, width, height, priority, className }: Props) => {
  // Get the base URL from environment variables
  const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL;

  // --- DIAGNOSTIC AND SAFETY CHECKS ---
  if (!src) {
    // If no src is provided, don't render anything
    return null;
  }
  
  if (!payloadUrl) {
    // If the environment variable is missing, log a clear error and don't render
    console.error("ERROR: NEXT_PUBLIC_PAYLOAD_URL environment variable is not set!");
    return <span>Image Error: Server URL not configured.</span>;
  }
  // ------------------------------------
const imageUrl = new URL(src, payloadUrl).toString(); // Construct the full URL

  return (
    <Image
      src={imageUrl}
      alt={alt || 'Image from Africa Project'}
      width={width || 500}
      height={height || 500}
      priority={priority}
      className={className}
    />
  );
};