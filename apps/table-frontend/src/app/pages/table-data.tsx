import React from 'react';
import { ImpactFileList } from '@foodmedicine/interfaces';
import { FindOutMore } from '@foodmedicine/components';
import { Effective, EffectiveProps } from '../components/effective';
import { FromResearch, FromResearchProps } from '../components/from-research';

export function generateData(fileList: ImpactFileList) {
  const fullRemedyList = fileList.map((impactedList) =>
    impactedList.recommendations.map((impactRecommendation) => {
      return {
        impacted: impactedList.impacted,
        recommendation: impactRecommendation.recommendation,
        effective: (
          <FindOutMore<EffectiveProps>
            ExpandedComponent={Effective}
            ExpandedComponentProps={{
              fileName: impactRecommendation.filename,
            }}
          />
        ),
        fromResearch: (
          <FindOutMore<FromResearchProps>
            ExpandedComponent={FromResearch}
            ExpandedComponentProps={{
              fileName: impactRecommendation.filename,
            }}
          />
        ),
      };
    })
  );
  return fullRemedyList.flat();
}
