import { Column, Table } from "./components/Table";

export function App() {
  return (
    <Table>
      <Column dataKey="test-key-1"></Column>
      <Column dataKey="test-key-2"></Column>
    </Table>
  );
}
