"use client";

import { useState } from 'react';
import { Paper, UnstyledButton, Text } from '@mantine/core';
import { IconHome, IconGauge, IconLogout } from '@tabler/icons-react';
import Link from 'next/link';

export default function Sidebar() {
  const [active, setActive] = useState('/');

  const data = [
    { link: '/', label: 'Home', icon: IconHome },
    { link: '/dashboard', label: 'Dashboard', icon: IconGauge },
    { link: '/logout', label: 'Logout', icon: IconLogout },
  ];

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    fontSize: 14,
    color: '#495057',
    padding: '8px 12px',
    borderRadius: 4,
    fontWeight: 500,
    cursor: 'pointer',
  };

  const linkHoverStyle = {
    backgroundColor: '#f8f9fa',
    color: '#000',
  };

  const linkIconStyle = {
    marginRight: 8,
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Paper
      shadow="sm"
      radius={0}
      p="md"
      withBorder
      style={{
        backgroundColor: 'var(--mantine-color-white, #fff)',
        paddingTop: 16,
        height: '100vh',
        position: 'sticky',
        top: 0,
        width: 250,
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--mantine-color-gray-3, #dee2e6)',
      }}
    >
      <div
        style={{
          paddingBottom: 16,
          marginBottom: 24,
          borderBottom: '1px solid var(--mantine-color-gray-3, #dee2e6)',
        }}
      >
        <Text weight={700} size="lg">
          Galdinho
        </Text>
      </div>
      <div style={{ flexGrow: 1 }}>
        {data.map((item) => (
          <Link href={item.link} key={item.label} passHref legacyBehavior>
            <UnstyledButton
              component="a"
              style={{
                ...linkStyle,
                ...(active === item.link ? linkHoverStyle : {}),
              }}
              onClick={() => setActive(item.link)}
            >
              <item.icon style={linkIconStyle} stroke={1.5} />
              <Text size="sm">{item.label}</Text>
            </UnstyledButton>
          </Link>
        ))}
      </div>
    </Paper>
  );
}
