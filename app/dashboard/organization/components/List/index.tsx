"use client";
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
import { getOrganizations } from "../../action";
import { OrganizationRecord } from "@/xata/xata";
import { IconEdit } from "@tabler/icons-react";
import OrganizationEditor from "@/components/OrganizationEditor";

export type organizationItem = SelectedPick<OrganizationRecord, "*"[]>;

export default function CustomList({ pageSize = 15 }: { pageSize?: number }) {
  const [organizations, setOrganizations] = useState<organizationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [activePage, setPage] = useState(1);

  const [opened, { open, close }] = useDisclosure(false);
  const [editingOrganization, setEditingOrganization] =
    useState<organizationItem>();

  async function fetchOrganizationList() {
    const { organizations, total } = await getOrganizations({
      offset: (activePage - 1) * pageSize,
    });
    setOrganizations(organizations.records);
    setTotal(total);
  }

  useEffect(() => {
    fetchOrganizationList();
  }, [activePage]);

  const rows = organizations.map((record) => (
    <TableTr key={record.id}>
      <TableTd>
        <Group justify="space-between">
          {record.name}
          <ActionIcon
            size="sm"
            onClick={() => {
              setEditingOrganization(record);
              open();
            }}
          >
            <IconEdit />
          </ActionIcon>
        </Group>
      </TableTd>
      <TableTd>{record.status}</TableTd>
      <TableTd>{dayjs(record.creationTime).format("YYYY-MM-DD")}</TableTd>
      <TableTd style={{ maxWidth: 200 }}>{record.description}</TableTd>
    </TableTr>
  ));

  return (
    <>
      <Group justify="flex-end" my="md">
        <Button
          onClick={() => {
            setEditingOrganization(undefined);
            open();
          }}
        >
          添加展商
        </Button>
      </Group>

      <TableScrollContainer minWidth={1200} my="md">
        <Table withTableBorder withColumnBorders striped highlightOnHover>
          <TableThead>
            <TableTr>
              <TableTh>名称</TableTh>
              <TableTh>状态</TableTh>
              <TableTh>建立时间</TableTh>
              <TableTh>描述</TableTh>
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

      <OrganizationEditor
        organization={editingOrganization}
        opened={opened}
        onClose={close}
      />
    </>
  );
}
