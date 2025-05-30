import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TicketsPage from "./index.tsx";

const meta: Meta<typeof TicketsPage> = {
    title: "Pages/TicketsPage",
    component: TicketsPage,
    parameters: {
        layout: "fullscreen", // Optional: fills preview area
    },
};

export default meta;

type Story = StoryObj<typeof TicketsPage>;

export const Default: Story = {
    render: () => <TicketsPage />,
};
