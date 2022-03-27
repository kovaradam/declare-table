import React from "react";

export function App() {
  const [checked, setChecked] = React.useState("all");
  const data = [
    { name: "name-1", type: "type-1", value: "1" },
    { name: "name-2", type: "type-2", value: "2" },
  ];
  return (
    <Table data={data}>
      {true && (
        <Column<typeof data[0]>
          id="check"
          label={
            <input
              value="all"
              type="checkbox"
              checked={checked == "all"}
              onChange={(event) => setChecked(event.target.value)}
            />
          }
          cell={(entry) => (
            <input
              type="checkbox"
              value={entry.value}
              checked={[entry.value, "all"].includes(checked)}
              onChange={(event) => setChecked(event.target.value)}
            />
          )}
        />
      )}
      <Column<typeof data[0]> dataKey="name" label="name" />
      <Column<typeof data[0]>
        dataKey="type"
        label={<code>type</code>}
        cell={(entry) => <button>{entry.type}</button>}
      />
    </Table>
  );
}

type TableChild<DataType> =
  | React.ReactElement<ColumnProps<DataType>>
  | boolean
  | null
  | undefined;

type Props<DataType> = {
  data: DataType[];
  children: TableChild<DataType>[];
};

function Table<DataType extends Record<string, unknown>>({
  children,
  ...props
}: Props<DataType>) {
  const columns = React.Children.map(children, (child) => {
    if (!isColumnComponent(child)) {
      return;
    }

    const props = child.props;

    return {
      ...props,
      render: (entry: DataType) => <DataCell {...child.props} entry={entry} />,
      _id: String(props.id ?? props.dataKey ?? props.label),
    };
  });

  return (
    <table>
      <thead>
        <tr>
          {columns?.map((column) => (
            <th key={column._id}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.data.map((entry) => (
          <tr key={JSON.stringify(entry)}>
            {columns?.map((column) => (
              <React.Fragment key={column._id}>
                {column.render(entry)}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type ColumnProps<DataType> = {
  dataKey?: keyof DataType & string;
  id?: string | number;
  label: React.ReactNode;
  cell?: (entry: DataType) => React.ReactNode;
  children?: (entry: DataType) => React.ReactNode;
};

const Column = <DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType>
) => {
  return null;
};

const DataCell = <DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType> & { entry: DataType }
): React.ReactElement => {
  const renderCell = props.cell ?? props.children;
  if (!renderCell) {
    if (props.dataKey === undefined) {
      throw { type: "No data key nor render cell function specified" };
    }
    return (
      <td>
        <>{props.entry[props.dataKey]}</>
      </td>
    );
  }
  return <td>{renderCell(props.entry)}</td>;
};

function isColumnComponent<DataType>(
  component: React.ReactNode
): component is React.ReactElement<ColumnProps<DataType>> {
  if (!component) {
    return false;
  }
  if (typeof component !== "object" || !("type" in component)) {
    throw new Error("Table children must be react nodes");
  }
  if (
    typeof component.type === "string" ||
    component.type.name !== Column.name
  ) {
    throw new Error("Table children must be Column components");
  }
  return true;
}
