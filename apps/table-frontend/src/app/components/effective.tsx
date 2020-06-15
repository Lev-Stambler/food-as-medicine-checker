import React, { useEffect } from 'react';
import { getFile } from './get-file-info';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';
import { parse } from 'querystring';
export interface EffectiveProps {
  fileName: string;
}

function checkIsEffective(
  parsedParagraphs: ParsedArticleParagraphStandalone[]
): ArticleParagraphBacksUpClaim {
  const totalRatedEffective = parsedParagraphs.reduce(
    (totalEffective, parsedP) =>
      (totalEffective +=
        parsedP.backsUpClaim === ArticleParagraphBacksUpClaim.yes ? 1 : 0),
    0
  );
  const totalRatedIneffective = parsedParagraphs.reduce(
    (totalEffective, parsedP) =>
      (totalEffective +=
        parsedP.backsUpClaim === ArticleParagraphBacksUpClaim.no ? 1 : 0),
    0
  );
  if (totalRatedEffective > parsedParagraphs.length * 0.5)
    return ArticleParagraphBacksUpClaim.yes;
  else if (totalRatedIneffective > parsedParagraphs.length * 0.5)
    return ArticleParagraphBacksUpClaim.no;
  return ArticleParagraphBacksUpClaim.notApplicable;
}

export function Effective(props: EffectiveProps) {
  let effective = ArticleParagraphBacksUpClaim.notApplicable;
  // useEffect(() => {
    const parsedParagraphs = getFile(props.fileName);
    effective = checkIsEffective(parsedParagraphs);
  // });
  return <div>{effective}</div>;
}
