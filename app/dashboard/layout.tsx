"use client";
import React, { useState } from "react";
import { Group, Code, Container } from "@mantine/core";
import { Title } from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
} from "@tabler/icons-react";
import classes from "./layout.module.css";
import Link from "next/link";

const linksData = [
  { link: "event", label: "展会", icon: IconBellRinging },
  { link: "organization", label: "展商", icon: IconReceipt2 },
//   { link: "", label: "Security", icon: IconFingerprint },
//   { link: "", label: "SSH Keys", icon: IconKey },
//   { link: "", label: "Databases", icon: IconDatabaseImport },
//   { link: "", label: "Authentication", icon: Icon2fa },
//   { link: "", label: "Other Settings", icon: IconSettings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState("展会");

  const links = linksData.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        // event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <div className={classes.body}>
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            <Title>FEC CMS</Title>
            <Code fw={700}>v1.0.0</Code>
          </Group>
          {links}
        </div>

        <div className={classes.footer}>
          <a
            href="#"
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>

          <a
            href="#"
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </nav>
      <div className={classes.main}>
        <Container size="md">
          <Title order={1}>{active}</Title>
          {children}
        </Container>
      </div>
    </div>
  );
}
