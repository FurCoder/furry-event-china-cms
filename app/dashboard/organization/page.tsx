import { Title } from "@mantine/core";
import { PAGE_SIZE } from "@/consts/normal";
import CustomList from "./components/List";

export default async function Event() {
  return (
    <>
      <Title order={2}>展商列表</Title>
      <CustomList pageSize={PAGE_SIZE} />
    </>
  );
}
