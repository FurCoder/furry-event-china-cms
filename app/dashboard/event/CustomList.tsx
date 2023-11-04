"use client";
import { EventRecord, Event, OrganizationRecord } from "@/xata/xata";
import {
  Table,
  TableScrollContainer,
  TableThead,
  TableTr,
  TableTd,
  TableTh,
  TableTbody,
  Pagination,
  Button,
  Modal,
  Box,
  TextInput,
  Group,
  Stack,
  Select,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { SelectedPick } from "@xata.io/client";
import { Suspense, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { DatePickerInput } from "@mantine/dates";
import { EventScale, EventStatus } from "@/types/event";
import { createEvent, getAllOrganizations, updateEvent } from "./actions";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";
import EventEditor from "@/components/EventEditor";

export default function CustomList({
  getEvents,
  initEvents,
  initTotal,
}: {
  initTotal: number;
  initEvents: {
    records: Readonly<SelectedPick<EventRecord, ["*"]>>[];
  };
  getEvents: (offset?: number) => Promise<{
    events: {
      records: Readonly<SelectedPick<EventRecord, ["*"]>>[];
    };
    total: number;
  }>;
}) {
  const [events, setEvents] = useState(initEvents.records);
  const [total, setTotal] = useState(initTotal);
  const [activePage, setPage] = useState(1);

  const [opened, { open, close }] = useDisclosure(false);
  const [editingEvent, setEditingEvent] = useState<Event>();

  async function fetchEventList() {
    const { events, total } = await getEvents((activePage - 1) * 20);
    setEvents(events.records);
    setTotal(total);
  }

  useEffect(() => {
    fetchEventList();
  }, [activePage]);

  const rows = events.map((record) => (
    <TableTr key={record.id}>
      <TableTd>{record.name}</TableTd>
      <TableTd>{record.status}</TableTd>
      <TableTd>{record.scale}</TableTd>
      <TableTd>{record.city}</TableTd>
      <TableTd>{record.organization.name}</TableTd>
      <TableTd>
        {dayjs(record.startDate).format("YYYY-MM-DD")} 到
        {dayjs(record.endDate).format("YYYY-MM-DD")}
      </TableTd>
      <TableTd>{record.address}</TableTd>
      <TableTd>
        <Button
          onClick={() => {
            setEditingEvent(record!);
            open();
          }}
        >
          Edit
        </Button>
      </TableTd>
    </TableTr>
  ));

  return (
    <>
      <Group justify="flex-end" mt="md">
        <Button
          onClick={() => {
            setEditingEvent(undefined);
            open();
          }}
        >
          添加展会
        </Button>
      </Group>

      <TableScrollContainer minWidth={1200}>
        <Table withTableBorder withColumnBorders>
          <TableThead>
            <TableTr>
              <TableTh>名称</TableTh>
              <TableTh>状态</TableTh>
              <TableTh>规模</TableTh>
              <TableTh>城市</TableTh>
              <TableTh>展商</TableTh>
              <TableTh>时间</TableTh>
              <TableTh>地址</TableTh>
              <TableTh>操作</TableTh>
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
        total={Math.ceil(total / 20)}
      />

      <EventEditor event={editingEvent} opened={opened} onClose={close} />
    </>
  );
}
