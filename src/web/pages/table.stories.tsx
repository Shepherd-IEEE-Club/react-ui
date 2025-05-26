import type { Meta, StoryObj } from '@storybook/react';

import Table from './table';

const meta = {
  component: Table,
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    postmarks: [],
    onRowClick: () => {},
    query: {}
  }
};