import React from 'react';
import { ImpactFileList } from '@foodmedicine/interfaces';
import { FindOutMore } from '@foodmedicine/components';
import {Effective, EffectiveProps} from '../components/effective'

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
              fileName: impactRecommendation.fileName,
            }}
          />
        ),
        // confidence: (
        //   <FindOutMore<any>
        //     ExpandedComponent={3}
        //     ExpandedComponentProps={{
        //       fileName: impactRecommendation.fileName,
        //     }}
        //   />
        // ),
        fromResearch: (
          <FindOutMore<any>
            ExpandedComponent={3}
            ExpandedComponentProps={{
              fileName: impactRecommendation.fileName,
            }}
          />
        ),
      };
    })
  );
  return fullRemedyList.flat();
  // {
  //   impacted: 'brain',
  //   recommendation: 'ginger',
  //   effective: <FindOutMore />,
  //   confidence: <FindOutMore />,
  //   fromResearch: <FindOutMore />,
  //   // <ExpandedList
  //   //   dataPoints={[{ title: 'asas', titleUrl: 'asa', items: ['111', '222'] }]}
  //   // />
  // },
}
