"use client";

import { useState } from 'react';
import { Navbar, Group, UnstyledButton, Text, createStyles, rem } from '@mantine/core';
import { IconHome, IconCreditCard, IconCalendarEvent, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    paddingTop: theme.spacing.md,
    height: '100vh',
    position: 'sticky',
    top: 0,
  },

  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: theme.spacing.md * 1.5,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  link: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  linkIcon: {
    marginRight: theme.spacing.sm,
    display: 'flex',
    alignItems: 'center',
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

const data = [
  { link: '/', label: 'Início', icon: IconHome },
  { link: '/pagamentos', label: 'Pagamentos', icon: IconCreditCard },
  { link: '/agendamentos', label: 'Agendamentos', icon: IconCalendarEvent },
  { link: '/logout', label: 'Logout', icon: IconLogout },
];

export default function AppNavbar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('/');

  const links = data.map((item) => (
    <Link href={item.link} key={item.label} passHref legacyBehavior>
      <UnstyledButton
        component="a"
        className={cx(classes.link, { [classes.linkActive]: active === item.link })}
        onClick={() => setActive(item.link)}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <Text size="sm">{item.label}</Text>
      </UnstyledButton>
    </Link>
  ));

  return (
    <Navbar width={{ base: 250 }} p="md" className={classes.navbar}>
      <Navbar.Section className={classes.header}>
        <Text weight={700} size="lg">
          Sistema de Transporte
        </Text>
      </Navbar.Section>
      <Navbar.Section grow>{links}</Navbar.Section>
    </Navbar>
  );
}
