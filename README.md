```jsx
import { Table } from "declare-table";

function UsersTable() {
  const tableData = [
    { name: "joe", age: 30 },
    { name: "jane", age: 32 },
  ];

  return (
    <Table data={tableData}>
      <Table.Column dataKey="name" label="Name" />
      <Table.Column dataKey="age" label="Age" />
    </Table>
  );
}
```
