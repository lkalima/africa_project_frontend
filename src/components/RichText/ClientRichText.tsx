'use client';

import React from 'react';
import Link from 'next/link';

// This is the definitive Rich Text component for the MVP.
// It handles basic formatting and internal/external links.
export const ClientRichText = ({ nodes }: { nodes: any[] }) => {
  if (!nodes) return null;

  return (
    <>
      {nodes.map((node, i) => {
        // --- Text Nodes with Formatting ---
        if (node.type === 'text') {
          let text = (
            <span dangerouslySetInnerHTML={{ __html: node.text.replace(/\n/g, '<br>') }} />
          );

          if (node.bold) {
            text = <strong>{text}</strong>;
          }
          if (node.italic) {
            text = <em>{text}</em>;
          }
          if (node.underline) {
            text = <u>{text}</u>;
          }
          if (node.strikethrough) {
            text = <s>{text}</s>;
          }

          // Return the final formatted text with a unique key
          return <React.Fragment key={i}>{text}</React.Fragment>;
        }

        // --- Element Nodes (p, h1, li, etc.) ---
        if (!node) {
          return null;
        }

        switch (node.tag) {
          case 'h1':
            return <h1 key={i}><ClientRichText nodes={node.children} /></h1>;
          case 'h2':
            return <h2 key={i}><ClientRichText nodes={node.children} /></h2>;
          case 'h3':
            return <h3 key={i}><ClientRichText nodes={node.children} /></h3>;
          case 'h4':
            return <h4 key={i}><ClientRichText nodes={node.children} /></h4>;
          case 'ul':
            return <ul key={i}><ClientRichText nodes={node.children} /></ul>;
          case 'ol':
            return <ol key={i}><ClientRichText nodes={node.children} /></ol>;
          case 'li':
            return <li key={i}><ClientRichText nodes={node.children} /></li>;
          
          // --- Link Node ---
          case 'link':
            // This handles links to other documents or external URLs
            const href = node.fields.doc?.value.slug 
              ? `/${node.fields.doc.relationTo}/${node.fields.doc.value.slug}`
              : node.fields.url;

            return (
              <Link href={href} key={i} className="text-blue-400 hover:underline">
                <ClientRichText nodes={node.children} />
              </Link>
            );

          default:
            // For paragraphs and any other unknown tags
            return <p key={i}><ClientRichText nodes={node.children} /></p>;
        }
      })}
    </>
  );
};