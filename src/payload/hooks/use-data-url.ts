import { CollectionAfterChangeHook } from 'payload/types';
import sharp from 'sharp';

import { Media } from '@/payload/payload-types';

export const useDataUrl: CollectionAfterChangeHook<Media> = async ({
  context,
  doc,
  operation,
  req: { payload },
}) => {
  if (operation === 'update' || context?.ignoreAfterChange || !doc.url) {
    return;
  }

  const image = await fetch(doc.url);
  const imageBuffer = await image.arrayBuffer();
  const sharpBuffer = await sharp(imageBuffer).resize(50).toBuffer();
  const dataUrl = `data:${doc.mimeType};base64,${sharpBuffer.toString('base64')}`;

  await payload.update({
    collection: 'media',
    id: doc.id,
    data: {
      dataUrl,
    },
    context: {
      ignoreAfterChange: true,
    },
  });
};
