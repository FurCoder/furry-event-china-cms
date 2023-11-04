import {
  getAllOrganizations,
  updateEvent,
  createEvent,
} from "@/dashboard/event/actions";
import { EventStatus, EventScale } from "@/types/event";
import { OrganizationRecord } from "@/xata/xata";
import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { Event } from "@/xata/xata";

function EventEditor({
  event,
  opened,
  onClose,
}: {
  event: Event;
  opened: boolean;
  onClose: () => void;
}) {
  const [organizationList, setOrganizationList] = useState<
    OrganizationRecord[]
  >([]);
  const form = useForm({
    initialValues: {
      name: event?.name || "",
      startDate: event?.startDate,
      endDate: event?.endDate,
      city: event?.city || "",
      address: event?.address || "",
      website: event?.website || "",
      logoUrl: event?.logoUrl,
      coverUrl: event?.coverUrl,
      organization: event?.organization?.id,
      slug: event?.slug || "",
      detail: event?.detail || "",
      status: event?.status || EventStatus.EventScheduled,
      scale: event?.scale || EventScale.Cosy,
      addressLat: event?.addressLat || "",
      addressLon: event?.addressLon || "",
    },

    validate: {
      //   email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const fetchOrganizations = async () => {
    const res = await getAllOrganizations();
    setOrganizationList(res);
  };

  const organizationSelectOptions = organizationList.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleSubmit = async <T,>(formData: T) => {
    console.log(formData);
    if (event?.id) {
      const res = await updateEvent({
        id: event.id,
        ...formData,
      });
      if (res) {
        onClose();
        notifications.show({
          title: "更新成功",
          message: "更新展会数据成功",
          color: "teal",
        });
      }
      console.log("update res", res);
    } else {
      const res = await createEvent(formData);
      console.log("create res", res);
      if (res) {
        onClose();
        notifications.show({
          title: "更新成功",
          message: "创建展会数据成功",
          color: "teal",
        });
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={event ? "编辑展会" : "新建展会"}
      centered
      size="xl"
    >
      <Box mx="auto">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack justify="flex-start" gap="xs">
            <TextInput
              withAsterisk
              label="展会名称"
              {...form.getInputProps("name")}
            />

            <Select
              label="展会展方"
              data={organizationSelectOptions}
              {...form.getInputProps("organization")}
            />

            <TextInput
              withAsterisk
              label="展会Slug"
              {...form.getInputProps("slug")}
            />
            <Button
              onClick={() => {
                const selectedYear = form.values.startDate?.getFullYear();
                const selectedMonth = form.values.startDate
                  ?.toLocaleString("en-us", { month: "short" })
                  .toLocaleLowerCase();
                const city = form.values.city;
                console.log(selectedYear, selectedMonth, city);
                if (!selectedYear || !selectedMonth || !city) {
                  return;
                }
                form.setFieldValue(
                  "slug",
                  `${selectedYear}-${selectedMonth}-${city}-con`
                );
              }}
            >
              生成Slug
            </Button>

            <Select
              label="展会状态"
              placeholder="Pick value"
              data={Object.keys(EventStatus).map((key) => ({
                label: key,
                value: EventStatus[key],
              }))}
              {...form.getInputProps("status")}
            />

            <Select
              label="展会规模"
              placeholder="Pick value"
              data={Object.keys(EventScale).map((key) => ({
                label: key,
                value: EventScale[key],
              }))}
              {...form.getInputProps("scale")}
            />

            <Group gap="xs" grow>
              <DatePickerInput
                withAsterisk
                valueFormat="YYYY年MM月DD日"
                label="开始日期"
                placeholder="Pick date"
                {...form.getInputProps("startDate")}
                //   value={value}
                //   onChange={setValue}
              />
              <DatePickerInput
                withAsterisk
                label="结束日期"
                placeholder="Pick date"
                valueFormat="YYYY年MM月DD日"
                {...form.getInputProps("endDate")}
                //   value={value}
                //   onChange={setValue}
              />
            </Group>

            <Group gap="xs" grow>
              <NumberInput
                label="经度"
                placeholder="Hide controls"
                hideControls
                {...form.getInputProps("addressLat")}
              />

              <NumberInput
                label="纬度"
                placeholder="Hide controls"
                hideControls
                {...form.getInputProps("addressLon")}
              />
            </Group>

            <TextInput
              withAsterisk
              label="展会城市"
              {...form.getInputProps("city")}
            />

            <TextInput
              withAsterisk
              label="展会地址"
              {...form.getInputProps("address")}
            />

            <TextInput
              withAsterisk
              label="展会信源"
              {...form.getInputProps("website")}
            />

            <Textarea
              label="展会描述"
              description="Input description"
              placeholder="Input placeholder"
              autosize
              maxRows={20}
              {...form.getInputProps("detail")}
            />
          </Stack>

          <Group justify="flex-end" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Modal>
  );
}

export default EventEditor;
