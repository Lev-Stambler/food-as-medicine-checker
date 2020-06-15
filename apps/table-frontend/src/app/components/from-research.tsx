import React, { useEffect } from 'react';
import { getFile } from './get-file-info';
import './from-research.css';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';

interface Paragraph {
  url: string;
  body: string;
}

export interface FromResearchProps {
  fileName: string;
}

function LinkedShortParagraph(props: { paragraph: Paragraph }) {
  function shortenText(text: string) {
    return text.length > 400 ? text.substring(0, 400) + '...' : text;
  }

  return (
    <p
      className="linked-short-p"
      onClick={() => window.open(props.paragraph.url, '_blank')}
    >
      {shortenText(props.paragraph.body)}
    </p>
  );
}

function getParagraphs(
  parsedParagraphs: ParsedArticleParagraphStandalone[]
): Paragraph[] {
  return parsedParagraphs.map((parsedParagraph) => {
    return {
      url: parsedParagraph.head.xmlFullTextDownloadLink,
      body: parsedParagraph.body,
    };
  });
}

export function FromResearch(props: FromResearchProps) {
  const parsedParagraphs = getFile(props.fileName);
  const paragraphs: Paragraph[] = getParagraphs(parsedParagraphs);
  return (
    <div>
      {paragraphs.map((paragraph) => (
        <>
          <LinkedShortParagraph paragraph={paragraph} />
        </>
      ))}
    </div>
  );
}
