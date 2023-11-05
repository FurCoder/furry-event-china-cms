"use server";

import { OrganizationRecord, XataClient } from "@/xata/xata";
import { EditableData, Identifiable } from "@xata.io/client";
const xata = new XataClient();

export async function getOrganizations({
  offset = 0,
  size = 15,
}: {
  offset?: number;
  size?: number;
}) {
  "use server";
  try {
    const total = await await xata.db.organization.summarize({
      summaries: {
        total: { count: "*" },
      },
    });
    total;
    const organizations = await xata.db.organization
      .select(["*"])
      .sort("xata.createdAt", "desc")
      .getPaginated({
        pagination: { size, offset },
      });
    return {
      organizations: {
        records: organizations.records.toArray(),
      },
      total: total.summaries[0].total,
    };
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

export async function createOrganization(
  event: Omit<EditableData<OrganizationRecord>, "id"> & Partial<Identifiable>
) {
  "use server";
  try {
    const res = await xata.db.organization.create(event);
    if (res.id) {
      return res;
    }
    throw new Error("Failed to create event.");
  } catch (error) {
    throw new Error("Failed to create event.");
  }
}

export async function updateOrganization(
  organization: Partial<EditableData<OrganizationRecord>> & Identifiable
) {
  "use server";
  try {
    const res = await xata.db.organization.update(organization);
    if (res?.id) {
      return res;
    }
  } catch (error) {
    throw new Error("Failed to update event.", { cause: error });
  }
}
