import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  isInline?: boolean;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // First handle dollar signs $...$ for math
    // Replace $$...$$ display math
    let formatted = content.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      try {
        return katex.renderToString(math.trim(), { displayMode: true, throwOnError: false });
      } catch {
        return `$$${math}$$`;
      }
    });

    // Replace $...$ inline math
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      try {
        // Handle common verbal phrases inside alttext math like "StartFraction ... EndFraction"
        let clean = math.trim()
          .replace(/StartFraction\s+(.*?)\s+Over\s+(.*?)\s+EndFraction/g, '\\frac{$1}{$2}')
          .replace(/left parenthesis/g, '(')
          .replace(/right parenthesis/g, ')')
          .replace(/equals/g, '=')
          .replace(/minus/g, '-')
          .replace(/plus/g, '+')
          .replace(/greater than/g, '>')
          .replace(/less than/g, '<')
          .replace(/negative/g, '-');

        return katex.renderToString(clean, { displayMode: false, throwOnError: false });
      } catch {
        return `$${math}$`;
      }
    });

    return formatted;
  }, [content]);

  return (
    <div 
      className={`math-rendered-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }} 
    />
  );
};
