import React, { useEffect } from 'react';
import { getFile } from './get-file-info';
import {
  ParsedArticleParagraphStandalone,
  ArticleParagraphBacksUpClaim,
} from '@foodmedicine/interfaces';

/**
 * The props to be passed into the {@code Effective} component
 * @param fileName - the file which contains the information for an impact, recommendation parring
 */
export interface EffectiveProps {
  fileName: string;
}

enum EffectiveString {
  yes = 'yes!',
  no = ': (',
  unsure = 'unsure \\_(-_-)_/',
}

interface Effectivity {
  effective: EffectiveString;
  confidence: number;
}

const UNSURE: Effectivity = {
  effective: EffectiveString.unsure,
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
      effective: EffectiveString.yes,
      confidence: totalRatedEffective / parsedParagraphs.length,
    };
  else if (totalRatedIneffective > parsedParagraphs.length * 0.5)
    return {
      effective: EffectiveString.no,
      confidence: totalRatedIneffective / parsedParagraphs.length,
    };
  return UNSURE;
}

export function Effective(props: EffectiveProps) {
  let effectiveness = UNSURE;
  const parsedParagraphs = getFile(props.fileName);
  effectiveness = checkIsEffective(parsedParagraphs);
  return (
    <div>
      <p>{effectiveness.effective}</p>
      <p>With {effectiveness.confidence * 100}% confidence</p>
    </div>
  );
}
