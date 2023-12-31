"use client";
import EventEditor from "@/components/EventEditor";
import { EventRecord } from "@/xata/xata";
import {
  ActionIcon,
  Button,
  Group,
  Pagination,
  Table,
  TableScrollContainer,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SelectedPick } from "@xata.io/client";
import dayjs from "dayjs";
import { Suspense, useEffect, useState } from "react";
import { getEvents } from "./actions";
import { EventStatusLabel, EventScaleLabel } from "@/consts/event";
import { IconEdit } from "@tabler/icons-react";

export type eventItem = SelectedPick<
  EventRecord,
  ("*" | "organization.id" | "organization.name" | "organization.slug")[]
>;

export default function CustomList({ pageSize = 15 }: { pageSize?: number }) {
  const [events, setEvents] = useState<eventItem[]>([]);
  const [total, setTotal] = useState(0);
  const [activePage, setPage] = useState(1);

  const [opened, { open, close }] = useDisclosure(false);
  const [editingEvent, setEditingEvent] = useState<eventItem>();

  async function fetchEventList() {
    const { events, total } = await getEvents({
      offset: (activePage - 1) * pageSize,
    });
    setEvents(events.records);
    setTotal(total);
  }

  useEffect(() => {
    fetchEventList();
  }, [activePage]);

  const rows = events.map((record) => (
    <TableTr key={record.id}>
      <TableTd>
        <Group justify="space-between">
          {record.name}
          <ActionIcon
            size="sm"
            onClick={() => {
              setEditingEvent(record);
              open();
            }}
          >
            <IconEdit />
          </ActionIcon>
        </Group>
      </TableTd>
      <TableTd>{EventStatusLabel[record.status]}</TableTd>
      <TableTd>{EventScaleLabel[record.scale]}</TableTd>
      <TableTd>{record.city}</TableTd>
      <TableTd>{record.organization?.name}</TableTd>
      <TableTd>
        {`${dayjs(record.startDate).format("YYYY-MM-DD")} - ${dayjs(
          record.endDate
        ).format("YYYY-MM-DD")}`}
      </TableTd>
      <TableTd>{record.address}</TableTd>
    </TableTr>
  ));

  return (
    <>
      <Group justify="flex-end" my="md">
        <Button
          onClick={() => {
            setEditingEvent(undefined);
            open();
          }}
        >
          添加展会
        </Button>
      </Group>

      <TableScrollContainer minWidth={1200} my="md">
        <Table withTableBorder withColumnBorders striped highlightOnHover>
          <TableThead>
            <TableTr>
              <TableTh>名称</TableTh>
              <TableTh>状态</TableTh>
              <TableTh>规模</TableTh>
              <TableTh>城市</TableTh>
              <TableTh>展商</TableTh>
              <TableTh>时间</TableTh>
              <TableTh>地址</TableTh>
            </TableTr>
          </TableThead>
          <Suspense fallback={"loading"}>
            <TableTbody>{rows}</TableTbody>
          </Suspense>
        </Table>
      </TableScrollContainer>
      <Pagination
        value={activePage}
        onChange={setPage}
        total={Math.ceil(total / pageSize)}
      />

      <EventEditor
        event={editingEvent}
        opened={opened}
        onClose={() => {
          close();
          fetchEventList();
        }}
      />
    </>
  );
}
