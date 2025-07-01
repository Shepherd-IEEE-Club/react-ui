import type { Meta, StoryObj } from '@storybook/react';

import Preferences from './Preferences';

const meta = {
  component: Preferences,
} satisfies Meta<typeof Preferences>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};