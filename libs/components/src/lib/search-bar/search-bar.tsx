import React, { useState } from 'react';
import ReactSearchBox from 'react-search-box';
import './search-bar.css';

interface SearchBarProps {
  onSearch: (val: string) => Promise<string>;
}

export function SearchBar(props: SearchBarProps) {
  const [searchVal, setSearchVal] = useState('');
  const data = [
    {
      key: 'john',
      value: 'John Doe',
    },
    {
      key: 'jane',
      value: 'Jane Doe',
    },
    {
      key: 'mary',
      value: 'Mary Phillips',
    },
    {
      key: 'robert',
      value: 'Robert',
    },
    {
      key: 'karius',
      value: 'Karius',
    },
  ];

  return (
    <div className="search-bar-container">
      <ReactSearchBox
        placeholder="Your Search"
        value={searchVal}
        data={data}
        onChange={(val) => setSearchVal(val)}
        callback={(record) => console.log(record)}
      />
      <button onClick={() => props.onSearch(searchVal)}>Search</button>
    </div>
  );
}
