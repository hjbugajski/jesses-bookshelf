import { getPayloadHMR } from '@payloadcms/next/utilities';
import { notFound } from 'next/navigation';
import { Metadata } from 'next/types';

import { metadata } from '@/app/(site)/layout';
import { Serialize } from '@/components/serialize';
import payloadConfig from '@payload-config';

interface PageProps {
  params: { slug: string[] };
}

const pageTitle = (title: string | undefined, metadata: Metadata) =>
  !title || title?.toLowerCase() === 'home' ? metadata.title : `${title} | ${metadata.title}`;

const fetchPages = async () => {
  const payload = await getPayloadHMR({ config: payloadConfig });
  const where = { _status: { equals: 'published' } };
  const limit = await payload
    .find({ collection: 'pages', where })
    .then(({ totalDocs }) => totalDocs);
  const pages = await payload.find({ collection: 'pages', where, limit });

  return pages.docs.map(({ slug }) => ({ slug }));
};

const fetchPage = async (segments: string[]) => {
  const slugSegments = segments || ['home'];
  const slug = slugSegments[slugSegments.length - 1];
  const payload = await getPayloadHMR({ config: payloadConfig });
  const page = await payload.find({
    collection: 'pages',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  });

  return page?.docs?.[0] || null;
};

export async function generateStaticParams() {
  try {
    const pages = await fetchPages();

    return pages.map(({ slug }) => ({ slug: [slug] }));
  } catch {
    return [{ slug: undefined }];
  }
}

export async function generateMetadata({ params: { slug } }: PageProps) {
  const page = await fetchPage(slug);

  return {
    title: pageTitle(page?.title, metadata),
    description: page?.description || metadata.description,
  };
}

export default async function Page({ params: { slug } }: PageProps) {
  const page = await fetchPage(slug);

  if (!page) {
    notFound();
  }

  return page.content?.root?.children && <Serialize nodes={page.content.root.children} />;
}
