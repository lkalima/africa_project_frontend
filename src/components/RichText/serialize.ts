// src/components/RichText/serialize.ts
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical';

type SafeNode = {
  type: string;
  children?: SafeNode[];
  [key: string]: unknown;
};

export function serializeLexical(nodes: SerializedLexicalNode[]): SafeNode[] {
  if (!nodes) return [];

  return nodes.map((node) => {
    if (node.type === 'text') {
      // Pass through text formatting
      return {
        type: 'text',
        text: node.text,
        bold: node.bold,
        italic: node.italic,
        underline: node.underline,
        strikethrough: node.strikethrough,
      };
    }

    if (!node) return null;

    // For other nodes, pass the type and recursively serialize children
    return {
      type: node.type,
      children: serializeLexical(node.children),
      // Pass through any other relevant props from the node
      ...('format' in node && { format: node.format }),
      ...('tag' in node && { tag: node.tag }),
      ...('url' in node && { url: node.url }),
      ...('fields' in node && { fields: node.fields }),
    };
  }).filter(Boolean); // Remove any null nodes
}