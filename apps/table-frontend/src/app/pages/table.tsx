import React, { useEffect } from 'react';
import { useTable } from 'react-table';
import { ExpandedList } from '@foodmedicine/components';
import MaterialTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// const test = require('../rated-paragraphs/a.json')
const fileList = require('../rated-paragraphs/alist.json');

async function getData() {
  console.log(test);
}

const data = [
  {
    impacted: 'brain',
    recommendation: 'ginger',
    effective: 'No',
    confidence: '10',
    fromResearch: (
      <ExpandedList
        dataPoints={[{ title: 'asas', titleUrl: 'asa', items: ['111', '222'] }]}
      />
    ),
  },
];
const columns = [
  {
    Header: 'Impacted',
    accessor: 'impacted',
  },
  {
    Header: 'Recommendation',
    accessor: 'recommendation',
  },
  {
    Header: 'Is it effective?',
    accessor: 'effective',
  },
  {
    Header: 'How sure are we?',
    accessor: 'confidence',
  },
  {
    Header: () => <strong>Check out the research</strong>,
    expander: true,
    Expander: ({ isExpanded, ...rest }) => (
      <div>{isExpanded ? <span>Hello</span> : <span>Goodbye</span>}</div>
    ),
    accessor: 'fromResearch',
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
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="app">
      <MaterialTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaterialTable>
    </div>
  );
};

export default Table;
