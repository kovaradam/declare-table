import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import "./index.css";
import { Table } from "./Table";

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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Table> = (args) => (
  <Table {...{ ...{ className: "table" }, ...args }} />
);

export const Plain = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Plain.args = {
  data: defaultData,
  children: [
    <Table.Column dataKey="name" label="Name" />,
    <Table.Column dataKey="age" label="Age" />,
  ],
};

export const DefaultStyle = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
DefaultStyle.args = {
  ...Plain.args,
  className: "",
};

export const WithJsxLabel = Template.bind({});
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

export const WithColumnFilter = Template.bind({});
WithColumnFilter.args = {
  data: defaultData,
  children: [
    <Table.Column<typeof defaultData[0]>
      label="Name"
      dataKey="name"
      filter={(entry) => entry.name.includes("jo")}
    />,
    <Table.Column dataKey="age" label="Age" />,
  ],
};
