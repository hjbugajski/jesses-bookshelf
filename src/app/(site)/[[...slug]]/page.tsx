import { getPayloadHMR } from '@payloadcms/next/utilities';
import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next/types';

import { metadata } from '@/app/(site)/layout';
import { Serialize } from '@/components/serialize';
import config from '@payload-config';

interface PageProps {
  params: { slug: string[] };
}

const pageTitle = (title: string | undefined, metadata: Metadata) =>
  !title || title?.toLowerCase() === 'home'
    ? metadata.title
    : `${title} | ${metadata.title as string}`;

const fetchPages = async () => {
  const payload = await getPayloadHMR({ config });
  const pages = await payload.find({
    collection: 'pages',
    where: { _status: { equals: 'published' } },
    pagination: false,
  });

  console.log(pages.docs.map(({ slug }) => ({ slug })));

  return pages.docs.map(({ slug }) => ({ slug }));
};

const fetchCachedPages = () => unstable_cache(fetchPages, [], { tags: ['pages'] })();

const fetchPage = async (slug: string) => {
  const payload = await getPayloadHMR({ config });
  const page = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  });

  return page?.docs?.[0] || null;
};

const fetchCachedPage = (segments?: string[]) => {
  const slugSegments = segments || ['home'];
  const slug = slugSegments[slugSegments.length - 1];

  return unstable_cache(fetchPage, [slug], { tags: [`page_${slug}`] })(slug);
};

export async function generateStaticParams() {
  try {
    const pages = await fetchCachedPages();

    return pages.map(({ slug }) => ({ slug: [slug] }));
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params: { slug } }: PageProps) {
  const page = await fetchCachedPage(slug);

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

export default async function Page({ params: { slug } }: PageProps) {
  const page = await fetchCachedPage(slug);

  if (!page) {
    notFound();
  }

  return page.content?.root?.children && <Serialize nodes={page.content.root.children} />;
}
