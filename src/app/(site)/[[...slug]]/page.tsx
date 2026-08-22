import { Suspense } from 'react';

import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';
import { getPayload } from 'payload';

import config from '@payload-config';

import { metadata } from '@/app/(site)/layout';
import { LivePreviewListener } from '@/components/live-preview-listener';
import { RichText } from '@/components/rich-text';
import { pageTag } from '@/payload/utils/cache-tags';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const pageTitle = (title: string | undefined, metadata: Metadata) =>
  !title || title?.toLowerCase() === 'home'
    ? metadata.title
    : `${title} | ${metadata.title as string}`;

const slugFromSegments = (segments: string[] | undefined) => {
  const slugSegments = segments || ['home'];

  return slugSegments[slugSegments.length - 1];
};

const findPage = async ({ draft, slug }: { draft: boolean; slug: string }) => {
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: 'pages',
    draft,
    pagination: false,
    limit: 1,
    overrideAccess: draft,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
};

const queryPublishedPage = async (slug: string) => {
  'use cache';
  cacheLife('max');
  cacheTag(pageTag(slug));

  return findPage({ draft: false, slug });
};

export async function generateStaticParams() {
  // Cache Components requires at least one param, so the root path is always
  // prerendered even when the database is unreachable or has no pages yet.
  const params: { slug: string[] | undefined }[] = [{ slug: undefined }];

  try {
    const payload = await getPayload({ config });
    const pages = await payload.find({
      collection: 'pages',
      draft: false,
      pagination: false,
      overrideAccess: false,
      select: {
        slug: true,
      },
    });

    for (const { slug } of pages.docs) {
      if (slug && slug !== 'home') {
        params.push({ slug: [slug] });
      }
    }
  } catch {
    // Fall back to the root path only.
  }

  return params;
}

export async function generateMetadata({ params }: PageProps) {
  'use cache';

  const { slug } = await params;
  const page = await queryPublishedPage(slugFromSegments(slug));

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

const PageSkeleton = () => (
  <div aria-hidden className="flex animate-pulse flex-col gap-12 py-6">
    <div className="flex flex-col items-center gap-8">
      <div className="h-48 w-48 rounded-4xl border-3 border-violet-400 bg-violet-200/50" />
      <div className="h-9 w-56 rounded-full bg-violet-200/50 xs:h-10" />
    </div>
    <div className="flex w-full flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[6.25rem] rounded-3xl border-3 border-violet-400 bg-gradient-to-br from-violet-300/50 to-violet-200/50"
        />
      ))}
    </div>
  </div>
);

const PageContent = async ({ params }: PageProps) => {
  const [{ slug }, { isEnabled: draft }] = await Promise.all([params, draftMode()]);
  const page = draft
    ? await findPage({ draft: true, slug: slugFromSegments(slug) })
    : await queryPublishedPage(slugFromSegments(slug));

  if (!page) {
    notFound();
  }

  return (
    <>
      {draft ? <LivePreviewListener /> : null}
      <RichText data={page.content} />
    </>
  );
};

export default function Page({ params }: PageProps) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} />
    </Suspense>
  );
}
