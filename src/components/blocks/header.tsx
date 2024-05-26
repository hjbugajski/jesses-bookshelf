import { HTMLAttributes, forwardRef } from 'react';

import Image from 'next/image';

import { PayloadBlockHeader } from '@/lib/types/payload';
import { cn } from '@/lib/utils/cn';

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  block: PayloadBlockHeader;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ className, block: { heading, image }, ...props }, ref) => (
    <header
      ref={ref}
      className={cn('flex flex-col items-center gap-8 text-center', className)}
      {...props}
    >
      <Image
        src={image.url}
        width={image.width}
        height={image.height}
        placeholder="blur"
        blurDataURL={image.dataUrl}
        alt={image.alt}
        className="h-48 w-48 rounded border-3 border-violet-400 shadow-lg shadow-violet-300/50"
      />
      <h1 className="text-3xl font-bold xs:text-4xl">{heading}</h1>
    </header>
  ),
);
Header.displayName = 'Header';
