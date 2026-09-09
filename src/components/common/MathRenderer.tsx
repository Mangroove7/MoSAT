import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
  isInline?: boolean;
}

/**
 * Escapes currency dollar signs (e.g. "$200,000", "$15 entry", "$31.78") 
 * so they don't break KaTeX math formulas or cause LaTeX leakage.
 */
function escapeCurrency(text: string): string {
  if (!text) return '';
  // Currency with words or punctuation after: $200,000 in, $15 entry, $300 to
  let res = text.replace(/\$(\d[\d,]*(?:\.\d+)?)(?=\s+[a-zA-Z]|\s*$|\.\s*<|\.$)/g, '&#36;$1');
  // Standalone price inside paragraph: <p>$31.78.</p>
  res = res.replace(/(<[a-z]+[^>]*>)\$(\d[\d,]*(?:\.\d+)?)\.?(<\/[a-z]+>)/gi, '$1&#36;$2.$3');
  return res;
}

/**
 * Converts College Board's verbal accessible alt-text format
 * (e.g. "StartFraction 12 x plus 28 Over 4 EndFraction", "Superscript StartFraction ...", "equals", etc.)
 * into standard, crystal-clear LaTeX code.
 */
function cleanVerbalMath(text: string): string {
  if (!text) return '';

  let res = text;

  // 1. Unescape HTML entities inside math
  res = res
    .replace(/&minus;/g, '-')
    .replace(/&plusmn;/g, '\\pm ')
    .replace(/&ge;/g, '\\ge ')
    .replace(/&le;/g, '\\le ')
    .replace(/&times;/g, '\\times ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ndash;/g, '-')
    .replace(/&mdash;/g, '-')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'");

  // 2. StartFraction ... Over ... EndFraction (supports nested structures)
  let maxLoop = 6;
  while (res.includes('StartFraction') && maxLoop > 0) {
    res = res.replace(/StartFraction\s+((?:(?!StartFraction).)+?)\s+Over\s+((?:(?!StartFraction).)+?)\s+EndFraction/gi, '\\frac{$1}{$2}');
    maxLoop--;
  }

  // 3. Roots
  res = res.replace(/RootIndex\s+(\d+)\s+StartRoot\s+(.*?)\s+EndRoot/gi, '\\sqrt[$1]{$2}');
  res = res.replace(/StartRoot\s+(.*?)\s+EndRoot/gi, '\\sqrt{$1}');

  // 4. Absolute values
  res = res.replace(/StartAbsoluteValue\s+(.*?)\s+EndAbsoluteValue/gi, '|{$1}|');

  // 5. Superscripts with Baseline & fractions
  // e.g. "Superscript x plus c Baseline" -> "^{x plus c}"
  res = res.replace(/Superscript\s+(.*?)\s+Baseline/gi, '^{$1}');

  // Superscript followed by \frac{...}{...}
  res = res.replace(/Superscript\s*(\\frac\{.+?\}\{.+?\})/gi, '^{$1}');

  // Superscript followed by left parenthesis ... right parenthesis
  res = res.replace(/Superscript\s*left parenthesis\s*(.*?)\s*right parenthesis/gi, '^{(\$1)}');

  // Superscript followed by token or simple expression
  res = res.replace(/Superscript\s+([a-zA-Z0-9\+\-\.\/]+)/gi, '^{$1}');

  // Clean any remaining "Baseline"
  res = res.replace(/\bBaseline\b/gi, '');

  // 6. Common English verbal fractions
  const FRACTIONS: [RegExp, string][] = [
    [/\bone half\b/gi, '\\frac{1}{2}'],
    [/\bone third\b/gi, '\\frac{1}{3}'],
    [/\btwo thirds\b/gi, '\\frac{2}{3}'],
    [/\bone fourth\b/gi, '\\frac{1}{4}'],
    [/\bthree fourths\b/gi, '\\frac{3}{4}'],
    [/\bone quarter\b/gi, '\\frac{1}{4}'],
    [/\bthree quarters\b/gi, '\\frac{3}{4}'],
    [/\bone fifth\b/gi, '\\frac{1}{5}'],
    [/\btwo fifths\b/gi, '\\frac{2}{5}'],
    [/\bthree fifths\b/gi, '\\frac{3}{5}'],
    [/\bfour fifths\b/gi, '\\frac{4}{5}'],
    [/\bone sixth\b/gi, '\\frac{1}{6}'],
    [/\bfive sixths\b/gi, '\\frac{5}{6}'],
    [/\bone seventh\b/gi, '\\frac{1}{7}'],
    [/\btwo sevenths\b/gi, '\\frac{2}{7}'],
    [/\bfive sevenths\b/gi, '\\frac{5}{7}'],
    [/\bone eighth\b/gi, '\\frac{1}{8}'],
    [/\bthree eighths\b/gi, '\\frac{3}{8}'],
    [/\bfive eighths\b/gi, '\\frac{5}{8}'],
    [/\bseven eighths\b/gi, '\\frac{7}{8}'],
    [/\bone ninth\b/gi, '\\frac{1}{9}'],
    [/\btwo ninths\b/gi, '\\frac{2}{9}'],
    [/\bfour ninths\b/gi, '\\frac{4}{9}'],
    [/\bfive ninths\b/gi, '\\frac{5}{9}'],
    [/\bseven ninths\b/gi, '\\frac{7}{9}'],
    [/\beight ninths\b/gi, '\\frac{8}{9}'],
    [/\bone tenth\b/gi, '\\frac{1}{10}'],
    [/\bthree tenths\b/gi, '\\frac{3}{10}'],
    [/\bseven tenths\b/gi, '\\frac{7}{10}'],
    [/\bnine tenths\b/gi, '\\frac{9}{10}'],
    [/\bthree halves\b/gi, '\\frac{3}{2}'],
    [/\bfive halves\b/gi, '\\frac{5}{2}'],
    [/\bseven halves\b/gi, '\\frac{7}{2}'],
    [/\bnine halves\b/gi, '\\frac{9}{2}']
  ];

  for (const [pat, repl] of FRACTIONS) {
    res = res.replace(pat, repl);
  }

  // 7. Verbal math symbols, units, and words
  const SYMBOL_REPLACEMENTS: [RegExp, string][] = [
    [/\bleft parenthesis\b/gi, '('],
    [/\bright parenthesis\b/gi, ')'],
    [/\bleft bracket\b/gi, '['],
    [/\bright bracket\b/gi, ']'],
    [/\bequals\b/gi, '='],
    [/\bplus or minus\b/gi, '\\pm '],
    [/\bplus\b/gi, '+'],
    [/\bminus\b/gi, '-'],
    [/\bnegative\b/gi, '-'],
    [/\btimes\b/gi, '\\times '],
    [/\bdivided by\b/gi, '\\div '],
    [/\bgreater than or equal to\b/gi, '\\ge '],
    [/\bless than or equal to\b/gi, '\\le '],
    [/\bgreater than\b/gi, '>'],
    [/\bless than\b/gi, '<'],
    [/\bnot equal to\b/gi, '\\ne '],
    [/\bsquared\b/gi, '^2'],
    [/\bcubed\b/gi, '^3'],
    [/\bto the power of\b/gi, '^'],
    [/\bscript l\b/gi, '\\ell '],
    [/\bdollar sign\b|\bdollar\b/gi, '\\$'],
    [/\bpercent sign\b|\bpercent\b/gi, '\\%'],
    [/\bdegrees\b|\bdegree\b/gi, '^{\\circ}'],
    [/\bCelsius\b/gi, '^{\\circ}\\text{C}'],
    [/\bFahrenheit\b/gi, '^{\\circ}\\text{F}'],
    [/\bcomma\b/gi, ', '],
    [/\bperiod\b/gi, '.'],
    [/\bcosine\b/gi, '\\cos '],
    [/\bsine\b/gi, '\\sin '],
    [/\btangent\b/gi, '\\tan '],
    [/\bpi\b/gi, '\\pi '],
    [/\btheta\b/gi, '\\theta '],
    [/\bangle\b/gi, '\\angle '],
    [/\btriangle\b/gi, '\\triangle '],
    [/\bcentimeters\b|\bcentimeter\b/gi, '\\text{ cm}'],
    [/\binches\b|\binch\b/gi, '\\text{ in}'],
    [/\bfeet\b|\bfoot\b/gi, '\\text{ ft}'],
    [/\bmeters\b|\bmeter\b/gi, '\\text{ m}'],
    [/\bkilometers\b|\bkilometer\b/gi, '\\text{ km}'],
    [/\bkilograms\b|\bkilogram\b/gi, '\\text{ kg}'],
    [/\bgrams\b|\bgram\b/gi, '\\text{ g}'],
    [/\bhours\b|\bhour\b/gi, '\\text{ hr}'],
    [/\bminutes\b|\bminute\b/gi, '\\text{ min}'],
    [/\bseconds\b|\bsecond\b/gi, '\\text{ sec}']
  ];

  for (const [pat, repl] of SYMBOL_REPLACEMENTS) {
    res = res.replace(pat, repl);
  }

  return res.trim();
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const renderedHtml = useMemo(() => {
    if (!content) return '';

    // Step 1: Escape standalone currency amounts to prevent LaTeX leaks
    const safeContent = escapeCurrency(content);

    // Step 2: Handle $$...$$ display math
    let formatted = safeContent.replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => {
      const clean = cleanVerbalMath(math);
      try {
        return katex.renderToString(clean, { displayMode: true, throwOnError: false });
      } catch {
        return `<div class="katex-display font-mono text-center my-2 p-1">${clean}</div>`;
      }
    });

    // Step 3: Handle $...$ inline math
    formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
      const clean = cleanVerbalMath(math);
      try {
        return katex.renderToString(clean, { displayMode: false, throwOnError: false });
      } catch {
        return `<span class="katex-inline font-mono px-0.5">${clean}</span>`;
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
