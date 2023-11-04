"use server";

import { Event, XataClient } from "@/xata/xata";
const xata = new XataClient();

export async function getEvents(offset: number = 0) {
  "use server";
  try {
    const total = await await xata.db.event.summarize({
      summaries: {
        total: { count: "*" },
      },
    });
    total;
    const events = await xata.db.event
      .select([
        "*",
        "organization.name",
        "organization.id",
        "organization.slug",
      ])
      .sort("startDate", "desc")
      .getPaginated({
        pagination: { size: 20, offset },
      });
    return {
      events: {
        records: events.records.toArray(),
      },
      total: total.summaries[0].total,
    };
    // return {
    //   events,
    //   total: total.summaries[0].total,
    // };
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

export async function getAllOrganizations() {
  "use server";
  try {
    const organizations = await xata.db.organization.getAll();
    return organizations;
  } catch (error) {
    throw new Error("Failed to fetch data");
  }
}

export async function createEvent(event: Omit<Event, "id">) {
  "use server";
  try {
    const res = await xata.db.event.create(event);
    if (res.id) {
      return res;
    }
    throw new Error("Failed to create event.");
  } catch (error) {
    throw new Error("Failed to create event.");
  }
}

export async function updateEvent(event: Event) {
  "use server";
  try {
    const res = await xata.db.event.update(event);
    if (res?.id) {
      return res;
    }
  } catch (error) {
    throw new Error("Failed to update event.");
  }
}
