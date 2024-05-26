import { HTMLAttributes, forwardRef } from 'react';

import Link from 'next/link';

import { Icon } from '@/lib/components/icon';
import {
  PayloadBlockLinks,
  PayloadBlockLinksExternal,
  PayloadBlockLinksInternal,
} from '@/lib/types/payload';
import { cn } from '@/lib/utils/cn';
import { slugify } from '@/lib/utils/slugify';

type ExternalLinkProps = PayloadBlockLinksExternal['links'][0];
type InternalLinkProps = PayloadBlockLinksInternal['links'][0];

interface LinkProps extends HTMLAttributes<HTMLUListElement> {
  block: PayloadBlockLinks;
}

const internalHref = ({ anchor, relationship: { slug } }: InternalLinkProps) =>
  `${slug === '/home' ? '/' : slug}${anchor ? `#${anchor}` : ''}`;

const linkProps = (link: ExternalLinkProps | InternalLinkProps) => {
  const href = link.type === 'external' ? link.url : internalHref(link);

  return {
    href,
    ...(link.newTab ? { target: '_blank' } : {}),
    ...(link.type === 'external' ? { rel: link.rel.join(' ') } : {}),
    'data-umami-event': link.umamiEvent ?? 'Link',
    'data-umami-event-id': link.umamiEventId ?? slugify(link.text),
    'data-umami-event-url': href,
  };
};

export const Links = forwardRef<HTMLUListElement, LinkProps>(
  ({ className, block: { links }, ...props }, ref) => (
    <ul ref={ref} className={cn('flex w-full flex-col gap-4', className)} {...props}>
      {links.map((link) => (
        <li key={link.id}>
          <Link
            {...linkProps(link)}
            className="flex w-full items-center gap-4 rounded-sm border-3 border-violet-400 bg-gradient-to-br from-violet-300/50 to-violet-200/50 px-5 py-4 outline-none transition hover:border-violet-600 hover:shadow-lg hover:shadow-violet-300/50 focus-visible:ring focus-visible:ring-violet-600 focus-visible:ring-offset-3 focus-visible:ring-offset-violet-100"
          >
            <Icon name={link.icon} className="h-12 w-12 shrink-0" />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-xl font-medium leading-snug">{link.text}</span>
              <span className="truncate font-light leading-snug">{link.subtext}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  ),
);
Links.displayName = 'Links';
