import { IconName } from '@/lib/types/icon-name';

export interface PayloadMedia {
  id: string;
  alt: string;
  dataUrl: string;
  updatedAt: string;
  createdAt: string;
  url: string;
  thumbnailURL: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  sizes: {
    thumbnail: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
  };
}

export interface PayloadPage {
  id: string;
  title: string;
  description: string;
  content?: {
    root: {
      type: string;
      children: {
        type: string;
        version: number;
        [k: string]: unknown;
      }[];
      direction: ('ltr' | 'rtl') | null;
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | '';
      indent: number;
      version: number;
    };
    [k: string]: unknown;
  } | null;
  slug: string;
  updatedAt: string;
  createdAt: string;
  _status: 'draft' | 'published';
}

export interface PayloadBlockHeader {
  heading: string;
  image: PayloadMedia;
  id: string;
  blockName?: string | null;
  blockType: 'header';
}

export interface PayloadBlockLinksExternal {
  links: {
    text: string;
    subtext: string;
    icon: IconName;
    type: 'external';
    url: string;
    rel: ('noreferrer' | 'nofollow')[];
    newTab?: boolean | null;
    umamiEvent?: string | null;
    umamiEventId?: string | null;
    id: string;
  }[];
  id: string;
  blockName?: string | null;
  blockType: 'links';
}

export interface PayloadBlockLinksInternal {
  links: {
    text: string;
    subtext: string;
    icon: IconName;
    type: 'internal';
    relationship: PayloadPage;
    anchor?: string | null;
    newTab?: boolean | null;
    umamiEvent?: string | null;
    umamiEventId?: string | null;
    id: string;
  }[];
  id: string;
  blockName?: string | null;
  blockType: 'links';
}

export type PayloadBlockLinks = PayloadBlockLinksExternal | PayloadBlockLinksInternal;
