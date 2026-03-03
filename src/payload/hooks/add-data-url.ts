import type { CollectionAfterChangeHook } from 'payload';

import type { PayloadMediaCollection } from '@/payload/payload-types';
import { createDataUrl } from '@/payload/utils/create-data-url';

export const addDataUrl: CollectionAfterChangeHook<PayloadMediaCollection> = async ({
  context,
  doc,
  req,
}) => {
  if (!req.file?.data || context?.ignoreAddDataUrl) {
    return doc;
  }

  const dataUrl = await createDataUrl(req.file.data, doc.mimeType);

  return req.payload.update({
    collection: 'media',
    id: doc.id,
    data: { dataUrl },
    context: { ignoreAddDataUrl: true },
    req: { transactionID: req.transactionID, user: req.user },
  });
};
