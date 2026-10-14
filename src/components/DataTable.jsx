import React from 'react';
import Spinner from './Spinner';
import EmptyState from './EmptyState';

/**
 * Reusable Mobile-Friendly Data Table Component
 */
export const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyMessage = 'No matching entries are available at this time.',
  keyAccessor = 'id',
  className = ''
}) => {
  if (loading) {
    return (
      <div className="table-loading-container">
        <Spinner text="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyMessage} />;
  }

  return (
    <div className={`table-responsive ${className}`.trim()}>
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={col.header || idx} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => {
            const rowKey = typeof keyAccessor === 'function' ? keyAccessor(row) : row[keyAccessor] || rowIdx;
            return (
              <tr key={rowKey}>
                {columns.map((col, colIdx) => {
                  let cellContent;
                  if (typeof col.render === 'function') {
                    cellContent = col.render(row, rowIdx);
                  } else if (typeof col.accessor === 'function') {
                    cellContent = col.accessor(row);
                  } else {
                    cellContent = row[col.accessor];
                  }

                  return (
                    <td key={col.header || colIdx} data-label={col.header}>
                      {cellContent !== undefined && cellContent !== null ? cellContent : '—'}
                    </td>
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

export default DataTable;
