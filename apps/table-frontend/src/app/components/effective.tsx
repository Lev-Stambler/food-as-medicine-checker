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

interface Effectivity {
  effective: string;
  confidence: number;
}

const UNSURE: Effectivity = {
  effective: 'unsure \\_(-_-)_/',
  confidence: 1,
};

function checkIsEffective(
  parsedParagraphs: ParsedArticleParagraphStandalone[]
): Effectivity {
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
    return {
      effective: 'yes!',
      confidence: totalRatedEffective / parsedParagraphs.length,
    };
  else if (totalRatedIneffective > parsedParagraphs.length * 0.5)
    return {
      effective: 'no :(',
      confidence: totalRatedIneffective / parsedParagraphs.length,
    };
  return UNSURE;
}

export function Effective(props: EffectiveProps) {
  let effectiveness = UNSURE;
  // useEffect(() => {
  const parsedParagraphs = getFile(props.fileName);
  effectiveness = checkIsEffective(parsedParagraphs);
  // });
  return (
    <div>
      <p>{effectiveness.effective}</p>
      <p>With {effectiveness.confidence * 100}% confidence</p>
    </div>
  );
}
