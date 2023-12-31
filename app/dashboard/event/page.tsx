import { Title } from "@mantine/core";
import CustomList from "./CustomList";
import { PAGE_SIZE } from "@/consts/normal";

export default async function Event() {
  return (
    <>
      <Title order={2}>展会列表</Title>
      <CustomList pageSize={PAGE_SIZE} />
    </>
  );
}
