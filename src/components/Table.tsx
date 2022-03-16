import React from "react";

export const Table: React.FC = ({ children, ...props }) => {
  const columns = React.Children.map(children, (child) => {
    if (!child) {
      return;
    }
    if (typeof child !== "object" || !("type" in child)) {
      throw new Error("Table children must be react nodes");
    }
    if (typeof child.type === "string" || child.type.name !== Column.name) {
      throw new Error("Table children must be Column components");
    }

    return child.props as ColumnProps;
  });

  return (
    <table>
      <thead>
        <tr>
          {columns?.map((column) => (
            <th key={column.dataKey}>{column.dataKey}</th>
          ))}
        </tr>
      </thead>
    </table>
  );
};

type ColumnProps = { dataKey: string };

export const Column: React.FC<ColumnProps> = (props) => {
  return null;
};

Column.displayName = "declare-table-column";
