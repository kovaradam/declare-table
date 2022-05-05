import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import "./index.css";
import { Table } from "declare-table";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Table",
  component: Table,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  // argTypes: {},
} as ComponentMeta<typeof Table>;

const defaultData = [
  { name: "joe", age: 30 },
  { name: "jane", age: 32 },
];

export const Basic = () => (
  <Table data={defaultData}>
    <Table.Column dataKey="name" label="Name" />
    <Table.Column dataKey="age" label="Age" />
  </Table>
);

export const WithStyling = () => (
  <Table data={defaultData} className="table">
    <Table.Column dataKey="name" label="Name" />
    <Table.Column dataKey="age" label="Age" />
  </Table>
);

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => (
  <Table {...{ ...{ className: "table" }, ...args }} />
);

export const WithJsxLabel = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithJsxLabel.args = {
  data: defaultData,
  children: [
    <Table.Column dataKey="name" label={<i>Name</i>} />,
    <Table.Column dataKey="age" label="Age" />,
  ],
};

export const WithJsxCell = Template.bind({});
WithJsxCell.args = {
  data: defaultData,
  children: [
    <Table.Column<typeof defaultData[0]>
      label="Name"
      cell={(entry) => <i>{entry.name}</i>}
    />,
    <Table.Column dataKey="age" label="Age" />,
  ],
};

export const WithTableFilter = Template.bind({});
WithTableFilter.args = {
  data: defaultData,
  filter: (entry) => (entry as typeof defaultData[0]).age > 30,
  children: [
    <Table.Column label="Name" dataKey="name" />,
    <Table.Column dataKey="age" label="Age" />,
  ],
};

export const WithColumnFilter = () => {
  const [nameFilterValue, setNameFilterValue] = React.useState("");

  return (
    <Table data={defaultData} className="table">
      <Table.Column<typeof defaultData[0]>
        label={
          <input
            placeholder="name filter"
            value={nameFilterValue}
            onChange={(event) => setNameFilterValue(event.target.value)}
          />
        }
        dataKey="name"
        filter={(entry) => entry.name.includes(nameFilterValue)}
      />
      <Table.Column dataKey="age" label="Age" />
    </Table>
  );
};

export const WithColumnToggle = () => {
  const [isAgeColumnVisible, toggleIsAgeColumnVisible] = React.useReducer(
    (p) => !p,
    true
  );

  return (
    <>
      <label>
        is age column visible{" "}
        <input
          type="checkbox"
          checked={isAgeColumnVisible}
          onChange={toggleIsAgeColumnVisible}
        />
      </label>
      <Table data={defaultData} className="table">
        <Table.Column label="Name" dataKey="name" />
        {isAgeColumnVisible && <Table.Column dataKey="age" label="Age" />}
      </Table>
    </>
  );
};
