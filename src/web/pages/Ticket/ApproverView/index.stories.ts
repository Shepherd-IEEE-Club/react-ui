import type { Meta, StoryObj } from '@storybook/react';
import Index from './index.tsx';

const meta = {
    component: Index,
    title: 'Tickets/ApproverView',
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof Index>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
