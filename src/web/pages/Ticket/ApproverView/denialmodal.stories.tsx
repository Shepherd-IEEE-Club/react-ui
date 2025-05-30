import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import DenialReasonModal from "./denialmodal.tsx";
import type { Ticket } from "@woco/schema/ticket";

const dummyTicket: Ticket = {
    id: 123,
    postmark_id: 1,
    user_id: 1,
    status: 1,
    changes: {},
    comment: "Incorrect town name",
    created_at: new Date().toISOString(),
};

const meta: Meta<typeof DenialReasonModal> = {
    title: "Components/DenialReasonModal",
    component: DenialReasonModal,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof DenialReasonModal>;

export const Default: Story = {
    args: {
        ticket: dummyTicket,
        onClose: () => alert("Modal closed"),
        onSubmit: (reason: string) => alert(`Submitted reason: ${reason}`),
    },
};
