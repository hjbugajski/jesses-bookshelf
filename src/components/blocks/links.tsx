import type { ComponentProps } from 'react';

import type { LinkProps } from 'next/link';
import Link from 'next/link';

import { Icon } from '@/components/ui/icon';
import type { PayloadLinksBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';
import { slugify } from '@/utils/slugify';

type PayloadLink = PayloadLinksBlock['links'][number];

type InternalLinkProps = {
  'data-umami-event'?: string | null;
  'data-umami-event-id'?: string | null;
  'data-umami-event-url'?: string | null;
};

const getInternalLink = (link: PayloadLink) => {
  if (!link) {
    return undefined;
  }

  return typeof link.relationship === 'string' ? link.relationship : link?.relationship?.slug;
};

const linkProps = (link: PayloadLink): LinkProps & InternalLinkProps => {
  const href = link.type === 'external' ? link.url : getInternalLink(link);

  return {
    href: href || '/',
    ...(link.newTab ? { target: '_blank' } : {}),
    ...(link.type === 'external' ? { rel: link?.rel?.join(',') } : {}),
    'data-umami-event': link.umamiEvent ?? 'Link',
    'data-umami-event-id': link.umamiEventId ?? slugify(link.text),
    'data-umami-event-url': href,
  };
};

type LinksProps = ComponentProps<'ul'> & {
  block: PayloadLinksBlock;
};

export const LinksBlock = ({ className, block: { links }, ...props }: LinksProps) => (
  <ul className={cn('flex w-full flex-col gap-4', className)} {...props}>
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
);
