/** Coarse tag on every cached page entry, expired whenever a page's content or a related document changes. */
export const pagesTag = 'pages';

export const pageTag = (slug: string) => `page:${slug}`;
