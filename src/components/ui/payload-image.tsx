/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';

import type { PayloadMediaCollection } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

export type PayloadImageProps = PayloadMediaCollection & {
  className?: string;
};

const PayloadImage = ({
  alt,
  createdAt,
  dataUrl,
  displayOriginal,
  filename,
  filesize,
  focalX,
  focalY,
  height: propsHeight,
  mimeType,
  sizes,
  thumbnailURL,
  updatedAt,
  url,
  width: propsWidth,
  ...props
}: PayloadImageProps) => {
  const src = displayOriginal ? url : sizes?.preview?.url;
  const width = displayOriginal ? propsWidth : sizes?.preview?.width;
  const height = displayOriginal ? propsHeight : sizes?.preview?.height;

  if (!src || !width || !height) {
    return null;
  }

  return (
    <Image
      src={src}
      width={width}
      height={height}
      placeholder="blur"
      blurDataURL={dataUrl ?? undefined}
      alt={alt}
      {...props}
    />
  );
};

export { PayloadImage };
