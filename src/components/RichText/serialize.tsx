import React, { Fragment } from 'react';
import escapeHTML from 'escape-html';
import Link from 'next/link';

// This is the definitive, client-safe serializer for Lexical content
export function serialize(nodes: any[]) {
  if (!nodes) return null;

  return nodes.map((node, i) => {
    // --- TEXT NODE ---
    // This is the most complex part, handling bold, italic, etc.
    if (node.type === 'text') {
      // The 'format' property is a bitmask. We need to check for specific bits.
      // 1 = bold, 2 = italic, 8 = underline, 16 = strikethrough
      let text = (
        <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text).replace(/\n/g, '<br>') }} />
      );
      if (node.format & 1) { // Bold
        text = <strong key={i}>{text}</strong>;
      }
      if (node.format & 2) { // Italic
        text = <em key={i}>{text}</em>;
      }
      if (node.format & 8) { // Underline
        text = <u key={i}>{text}</u>;
      }
      if (node.format & 16) { // Strikethrough
        text = <s key={i}>{text}</s>;
      }
      return <Fragment key={i}>{text}</Fragment>;
    }

    // --- ELEMENT NODES ---
    if (!node) return null;

    const children = node.children ? serialize(node.children) : null;

    switch (node.type) {
      case 'heading':
        const Tag = node.tag; // h1, h2, etc.
        return <Tag key={i}>{children}</Tag>;
      case 'list':
        const ListTag = node.tag; // ol, ul
        return <ListTag key={i}>{children}</ListTag>;
      case 'listitem':
        return <li key={i}>{children}</li>;
      case 'quote':
        return <blockquote key={i}>{children}</blockquote>;
      case 'link':
        const href = node.fields.linkType === 'internal'
          ? `/${node.fields.doc.relationTo}/${node.fields.doc.value.slug}`
          : node.fields.url;
        return <Link href={href || ''} key={i} className="text-blue-400 hover:underline">{children}</Link>;
      
      default: // paragraph is the default
        return <p key={i}>{children}</p>;
    }
  });
}