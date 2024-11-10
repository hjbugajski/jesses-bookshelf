import { Header } from '@/components/blocks/header';
import { Links } from '@/components/blocks/links';
import type { PayloadHeaderBlock, PayloadLinksBlock } from '@/payload/payload-types';

type BlocksProps = PayloadHeaderBlock | PayloadLinksBlock;

export function Blocks(props: BlocksProps) {
  const baseClassNames = 'py-6 first:pt-0 last:pb-0';

  switch (props.blockType) {
    case 'header':
      return <Header block={props} className={baseClassNames} />;
    case 'links':
      return <Links block={props} className={baseClassNames} />;
    default:
      return null;
  }
}
