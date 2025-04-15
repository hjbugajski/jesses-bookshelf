import type { SVGProps } from 'react';
import { forwardRef } from 'react';

import { Gift, Instagram, Link, Mail, OpenBook, Shop, Tiktok } from 'iconoir-react';

import type { IconName } from '@/types/icon-name';

const icons: Record<IconName, React.FC<SVGProps<SVGSVGElement>>> = {
  gift: Gift,
  instagram: Instagram,
  link: Link,
  mail: Mail,
  'open-book': OpenBook,
  shop: Shop,
  tiktok: Tiktok,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(({ name, ...props }, ref) => {
  const RenderIcon = icons[name];

  return RenderIcon ? <RenderIcon ref={ref} aria-hidden {...props} /> : null;
});
Icon.displayName = 'Icon';
