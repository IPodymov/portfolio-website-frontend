import React from 'react';
import './Table.css';

// Table Root
interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="table-container">
      <table className={`table ${className}`}>{children}</table>
    </div>
  );
};

// Table Head
interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
}

const TableHead: React.FC<TableHeadProps> = ({ children, className = '' }) => {
  return <thead className={`table__head ${className}`}>{children}</thead>;
};

// Table Body
interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

const TableBody: React.FC<TableBodyProps> = ({ children, className = '' }) => {
  return <tbody className={`table__body ${className}`}>{children}</tbody>;
};

// Table Row
interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const TableRow: React.FC<TableRowProps> = ({ children, onClick, className = '' }) => {
  return (
    <tr className={`table__row ${onClick ? 'table__row--clickable' : ''} ${className}`} onClick={onClick}>
      {children}
    </tr>
  );
};

// Table Header Cell
interface TableHeaderProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  align = 'left',
  width,
  className = '',
}) => {
  return (
    <th
      className={`table__header table__header--${align} ${className}`}
      style={width ? { width } : undefined}
    >
      {children}
    </th>
  );
};

// Table Cell
interface TableCellProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({ children, align = 'left', className = '' }) => {
  return <td className={`table__cell table__cell--${align} ${className}`}>{children}</td>;
};

export { Table, TableHead, TableBody, TableRow, TableHeader, TableCell };
export default Table;
