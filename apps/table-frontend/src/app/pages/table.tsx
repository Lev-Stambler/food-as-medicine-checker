import React from 'react';
import { useTable } from 'react-table';
const data = [
  {
    impacted: 'brain',
    recommendation: 'ginger',
    effective: 'No',
    confidence: '10',
    fromResearch: 'aaas',
  },
];
const columns = [
  {
    Header: 'Impacted',
    columns: [
      {
        Header: 'impacted',
        accessor: 'impacted',
      },
      {
        Header: 'impacted',
        accessor: 'impacated',
      },
    ],
  },
];
const Table = (props) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });
  return (
    <div className="app">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
