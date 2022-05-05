import React from "react";
import { Table } from "declare-table";

const dataSize = 1500;

const data = Array(dataSize)
  .fill(null)
  .map((_, index) => ({
    name: `name-${index}`,
    type: `type-${index}`,
    value: String(index),
  }));

export function App() {
  const [checked, setChecked] = React.useState("");
  const [isTypeColumnHidden, toggleIsTypeColumnHidden] = React.useReducer(
    (p) => !p,
    false
  );
  const [typeFilterValue, setTypeFilterValue] = React.useState("");
  const [tableFilterValue, setTableFilterValue] = React.useState("");
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
        className="table"
      >
        <Table.Column<typeof data[0]>
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
        <Table.Column<typeof data[0]> dataKey="name" label="name" />
        {!isTypeColumnHidden && (
          <Table.Column<typeof data[0]>
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
          <Table.Column
            id="all-checked"
            label={<span style={{ width: "20rem" }}>all checked</span>}
          >
            <div style={{ textAlign: "center", width: "100%" }}>&#128514;</div>
          </Table.Column>
        )}
      </Table>
    </>
  );
}
