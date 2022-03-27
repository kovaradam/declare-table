import React from "react";

export function App() {
  const data = [
    { name: "name-1", type: "type-1" },
    { name: "name-2", type: "type-2" },
  ];
  return (
    <Table data={data}>
      <Column<typeof data[0]>
        dataKey="name"
        label="name"
        cell={(entry) => entry.type.toUpperCase()}
      />
      <Column<typeof data[0]>
        dataKey="type"
        label={<code>type</code>}
        cell={(entry) => <button>{entry.type}</button>}
      />
    </Table>
  );
}

type Props<DataType> = {
  data: DataType[];
  children: React.ReactElement<ColumnProps<DataType>, typeof Column>[];
};

function Table<DataType extends Record<string, unknown>>({
  children,
  ...props
}: Props<DataType>) {
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

    return { ...child.props };
  });

  return (
    <table>
      <thead>
        <tr>
          {columns?.map((column) => (
            <th key={column.dataKey}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((entry) => (
          <tr>
            {columns.map((column) => (
              <td>
                <>{column.cell ? column.cell(entry) : entry[column.dataKey]}</>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type ColumnProps<DataType> = {
  dataKey: keyof DataType & string;
  label: React.ReactNode;
  cell?: (entry: DataType) => React.ReactNode;
  children?: (entry: DataType) => React.ReactNode;
};

const Column = <DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType>
) => {
  return null;
};
