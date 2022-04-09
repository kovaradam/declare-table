import React from "react";

export function App() {
  const [checked, setChecked] = React.useState("");
  const [isTypeColumnHidden, toggleIsTypeColumnHidden] = React.useReducer(
    (p) => !p,
    false
  );
  const [typeFilterValue, setTypeFilterValue] = React.useState("");
  const [tableFilterValue, setTableFilterValue] = React.useState("");

  const data = [
    { name: "name-1", type: "type-1", value: "1" },
    { name: "name-2", type: "type-2", value: "2" },
  ];

  return (
    <>
      <header>
        <label>
          Filter name column
          <input
            value={tableFilterValue}
            onChange={(event) => setTableFilterValue(event.target.value)}
          />
        </label>
        <label title="Hiding should disable column filtering">
          Hide type column
          <input
            value="hide-type-column"
            type="checkbox"
            checked={isTypeColumnHidden}
            onChange={toggleIsTypeColumnHidden}
          />
        </label>
      </header>
      <Table
        data={data}
        filter={(entry) => entry.name.includes(tableFilterValue)}
      >
        <Column<typeof data[0]>
          id="check"
          label={
            <input
              value="all"
              type="checkbox"
              checked={checked == "all"}
              onChange={(event) =>
                setChecked((prev) => (prev !== "all" ? event.target.value : ""))
              }
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
        <Column<typeof data[0]> dataKey="name" label="name" />
        {!isTypeColumnHidden && (
          <Column<typeof data[0]>
            filter={(entry) => entry.type.includes(typeFilterValue)}
            dataKey="type"
            label={
              <input
                placeholder="filter by type column"
                value={typeFilterValue}
                onChange={(event) => setTypeFilterValue(event.target.value)}
              />
            }
            cell={(entry) => {
              const cellValue = entry.type;
              const startMatchIdx = cellValue.indexOf(typeFilterValue);
              if (startMatchIdx === -1) {
                return cellValue;
              }
              return (
                <>
                  {cellValue.slice(0, startMatchIdx)}
                  <b>
                    {cellValue.slice(
                      startMatchIdx,
                      startMatchIdx + typeFilterValue.length
                    )}
                  </b>
                  {cellValue.slice(startMatchIdx + typeFilterValue.length)}
                </>
              );
            }}
          />
        )}
        {checked === "all" && (
          <Column
            id="all-checked"
            label={<span style={{ width: "20rem" }}>all checked</span>}
          >
            <div style={{ textAlign: "center", width: "100%" }}>&#128514;</div>
          </Column>
        )}
      </Table>
    </>
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
  filter?: (entry: DataType) => boolean;
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
      renderCell: (entry: DataType) => (
        <DataCell {...child.props} entry={entry} />
      ),
      _id: String(props.id ?? props.dataKey ?? props.label),
    };
  });

  const filters = columns
    ?.map((column) => column.filter as ColumnProps<DataType>["filter"])
    .concat(props.filter)
    .filter((filter) => filter !== undefined);

  const filteredData = filters?.length
    ? props.data.filter?.((entry) => filters.every((filter) => filter?.(entry)))
    : props.data;

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
        {filteredData.map((entry) => (
          <tr key={JSON.stringify(entry)}>
            {columns?.map((column) => (
              <React.Fragment key={column._id}>
                {column.renderCell(entry)}
              </React.Fragment>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type RenderCellProp<DataType> =
  | ((entry: DataType) => React.ReactNode)
  | React.ReactNode;

type ColumnProps<DataType> = {
  dataKey?: keyof DataType & string;
  id?: string | number;
  label: React.ReactNode;
  cell?: RenderCellProp<DataType>;
  children?: RenderCellProp<DataType>;
  filter?: (entry: DataType) => boolean;
};

const Column = <DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType>
) => {
  return null;
};

function DataCell<DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType> & { entry: DataType }
): React.ReactElement {
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

  return (
    <td>
      {typeof renderCell === "function" ? renderCell(props.entry) : renderCell}
    </td>
  );
}

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
