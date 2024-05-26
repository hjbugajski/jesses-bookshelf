/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import React from 'react';

import { RootLayout } from '@payloadcms/next/layouts';

import configPromise from '@/payload/payload.config';

import '@payloadcms/next/css';

type Args = {
  children: React.ReactNode;
};

const Layout = ({ children }: Args) => <RootLayout config={configPromise}>{children}</RootLayout>;

export default Layout;
