import React, { useState } from 'react';
interface FindOutMoreProps<T> {
  ExpandedComponent: React.ElementType<T>;//React.Component<T>;
  ExpandedComponentProps: T;
}

export function FindOutMore<T>(props: FindOutMoreProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Find out more</button>
      {isOpen && props.ExpandedComponent(props.ExpandedComponentProps) }
    </>
  );
}
