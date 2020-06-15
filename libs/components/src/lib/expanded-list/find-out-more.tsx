import React, { useState } from 'react';
interface FindOutMoreProps<T> {
  ExpandedComponent: React.ElementType<T>;//React.Component<T>;
  ExpandedComponentProps: T;
  width?: string;
}

export function FindOutMore<T>(props: FindOutMoreProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{width: props.width || "auto"}}>
      <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Close' : 'Find out more'}</button>
      {isOpen && props.ExpandedComponent(props.ExpandedComponentProps) }
    </div>
  );
}
