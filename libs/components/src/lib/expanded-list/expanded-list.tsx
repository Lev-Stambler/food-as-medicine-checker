import React, { useState } from 'react';
import Collapsible from 'react-collapsible';
import './expanded-list.css';

interface ExpandedListProps {
  dataPoints: {
    title: string;
    titleUrl: string;
    items: any[];
  }[];
}

const ListItems = (props: { items: any[]; index: number }) => {
  function getFirstNWords(text: string, n = 20): string {
    return text.split(' ').splice(0, n).join(' ');
  }
  return (
    <>
      {props.items.map((item, i) => {
        return (
          <div key={`list-item-${props.index}-${i}`}>
            <div className="item-container">{getFirstNWords(item)}</div>{' '}
          </div>
        );
      })}
    </>
  );
};

export const ExpandedList = (props: ExpandedListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Collapsible
        trigger={isOpen ? 'Close' : 'Expand'}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
      >
        {props.dataPoints.map((dataPoint, i) => {
          return (
            <div className="datapoint-wrapper" key={`datapoint-${i}`}>
              <a className="title" href={dataPoint.titleUrl}>
                {dataPoint.title}
              </a>
              <ListItems items={dataPoint.items} index={i} />
            </div>
          );
        })}
      </Collapsible>
    </>
  );
};
