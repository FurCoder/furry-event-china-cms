import { Title } from "@mantine/core";
import CustomList from "./CustomList";
import { getEvents } from "./actions";

export default async function Event() {
  const { events, total } = await getEvents();

  return (
    <>
      <Title order={2}></Title>
      <CustomList initEvents={events} initTotal={total} getEvents={getEvents} />
    </>
  );
}


