import { type ReactNode, cloneElement, isValidElement } from 'react';

import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical';
import type {
  SerializedEditorState,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import type {
  JSXConverters,
  JSXConvertersFunction,
  SerializedLexicalNodeWithParent,
} from '@payloadcms/richtext-lexical/react';

import { HeaderBlock } from '@/components/blocks/header';
import { LinksBlock } from '@/components/blocks/links';
import { blockQuoteConverter } from '@/components/rich-text/block-quote-converter';
import { headingConverter } from '@/components/rich-text/heading-converter';
import { horizontalRuleConverter } from '@/components/rich-text/horizontal-rule-converter';
import { listConverter } from '@/components/rich-text/list-converter';
import { listitemConverter } from '@/components/rich-text/listitem-converter';
import { paragraphConverter } from '@/components/rich-text/paragraph-converter';
import { textConverter } from '@/components/rich-text/text-converter';
import type { PayloadHeaderBlock, PayloadLinksBlock } from '@/payload/payload-types';
import { cn } from '@/utils/cn';

export type JSXConverter<
  T extends {
    [key: string]: any;
    type?: string;
  } = SerializedLexicalNode,
> = (args: {
  additionalClass?: string;
  childIndex: number;
  converters: JSXConverters;
  node: T;
  nodesToJSX: (args: {
    converters?: JSXConverters;
    disableIndent?: boolean | string[];
    disableTextAlign?: boolean | string[];
    nodes: SerializedLexicalNode[];
    parent?: SerializedLexicalNodeWithParent;
  }) => React.ReactNode[];
  overrideClass?: string;
  parent: SerializedLexicalNodeWithParent;
}) => React.ReactNode;

type NodeType =
  | DefaultNodeTypes
  | SerializedBlockNode<PayloadHeaderBlock | PayloadLinksBlock>
  | SerializedInlineBlockNode;

type Classes = {
  [nodeType in Exclude<NonNullable<NodeType['type']>, 'block' | 'inlineBlock'>]?: string;
} & {
  blocks?: {
    [K in Extract<
      Extract<
        NodeType,
        {
          type: 'block';
        }
      > extends SerializedBlockNode<infer B>
        ? B extends {
            blockType: string;
          }
          ? B['blockType']
          : never
        : never,
      string
    >]?: string;
  };
};

interface Props {
  additionalClasses?: Classes;
  data?: SerializedEditorState | null;
  overrideClasses?: Classes;
}

interface ConvertLexicalToJsxProps {
  additionalClasses?: Classes;
  converters: JSXConverters<NodeType>;
  nodes: NodeType[];
  overrideClasses?: Classes;
  parent: SerializedLexicalNodeWithParent;
}

const jsxConverters: JSXConvertersFunction<NodeType> = () => ({
  text: textConverter,
  paragraph: paragraphConverter,
  heading: headingConverter,
  blockquote: blockQuoteConverter,
  horizontalrule: horizontalRuleConverter,
  list: listConverter,
  listitem: listitemConverter,
  blocks: {
    header: ({ node }) => <HeaderBlock block={node.fields} className="py-6 first:pt-0 last:pb-0" />,
    links: ({ node }) => <LinksBlock block={node.fields} className="py-6 first:pt-0 last:pb-0" />,
  },
});

function convertLexicalToJsx({
  additionalClasses,
  converters,
  nodes,
  overrideClasses,
  parent,
}: ConvertLexicalToJsxProps): ReactNode[] {
  return nodes.map<ReactNode>((node, i) => {
    let additionalClass: string | undefined;
    let converter: JSXConverter<any> | undefined;
    let overrideClass: string | undefined;

    if (node.type === 'block') {
      additionalClass = additionalClasses?.blocks?.[node.fields.blockType];
      // @ts-expect-error – valid types
      converter = converters.blocks?.[node.fields.blockType];
      overrideClass = overrideClasses?.blocks?.[node.fields.blockType];
    } else if (node.type === 'inlineBlock') {
      additionalClass = undefined;
      converter = undefined;
      overrideClass = undefined;
    } else {
      additionalClass = additionalClasses?.[node.type];
      // @ts-expect-error – valid types
      converter = converters[node.type];
      overrideClass = overrideClasses?.[node.type];
    }

    if (!converter) {
      return null;
    }

    let formatClass: string | undefined;
    let indentClass: string | undefined;

    if ('format' in node) {
      switch (node.format) {
        case 'center':
          formatClass = 'text-center';
          break;
        case 'end':
          formatClass = 'text-right';
          break;
        case 'justify':
          formatClass = 'text-justify';
          break;
        case 'left':
          formatClass = 'text-left';
          break;
        case 'right':
          formatClass = 'text-right';
          break;
        case 'start':
          formatClass = 'text-left';
          break;
      }
    }

    if ('indent' in node) {
      switch (node.indent) {
        case 1:
          indentClass = 'indent-4';
          break;
        case 2:
          indentClass = 'indent-8';
          break;
        case 3:
          indentClass = 'indent-12';
          break;
        case 4:
          indentClass = 'indent-16';
          break;
      }
    }

    const reactNode = converter({
      additionalClass: cn(additionalClass, formatClass, indentClass),
      childIndex: i,
      // @ts-expect-error – valid types
      converters,
      node,
      nodesToJSX: (args) =>
        convertLexicalToJsx({
          additionalClasses,
          converters: args.converters ?? converters,
          nodes: args.nodes as unknown as NodeType[],
          overrideClasses,
          parent: args.parent ?? parent,
        }),
      overrideClass,
      parent,
    });

    if (!reactNode) {
      return null;
    }

    if (isValidElement(reactNode)) {
      return cloneElement(reactNode, {
        key: i,
      });
    }

    return reactNode;
  });
}

export function RichText({ data, overrideClasses }: Props) {
  if (!data?.root?.children?.length) {
    return null;
  }

  return convertLexicalToJsx({
    converters: jsxConverters({ defaultConverters: {} }),
    nodes: data.root.children as NodeType[],
    overrideClasses,
    parent: data.root,
  });
}
