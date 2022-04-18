import React from "react";

type TableChild<DataType> =
  | React.ReactElement<ColumnProps<DataType>>
  | boolean
  | null
  | undefined;

type Props<DataType> = React.HTMLAttributes<HTMLTableElement> & {
  data: DataType[];
  children: TableChild<DataType>[];
  filter?: (entry: DataType) => boolean;
};

export function Table<DataType extends Record<string, unknown>>({
  children,
  data,
  filter,
  ...tableProps
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
    .concat(filter)
    .filter((filter) => filter !== undefined);

  const filteredData = filters?.length
    ? data.filter?.((entry) => filters.every((filter) => filter?.(entry)))
    : data;

  return (
    <table {...tableProps}>
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

function Column<DataType extends Record<string, unknown>>(
  props: ColumnProps<DataType>
) {
  return null;
}

Table.Column = Column;

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
    component.type.name !== Table.Column.name
  ) {
    throw new Error("Table children must be Column components");
  }
  return true;
}
