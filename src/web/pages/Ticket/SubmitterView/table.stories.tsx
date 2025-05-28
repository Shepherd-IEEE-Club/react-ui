import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import TicketTable from "./table.tsx";
import type { Ticket } from "@woco/schema/ticket";

const meta: Meta<typeof TicketTable> = {
    title: "Tickets/TicketTable",
    component: TicketTable,
};

export default meta;

const sampleTickets: Ticket[] = [
    {
        id: 1,
        postmark_id: 101,
        user_id: 5,
        status_id: 1,
        changes: {},
        comment: "Request to update color",
        created_at: new Date("2024-01-01"),
    },
    {
        id: 2,
        postmark_id: 102,
        user_id: 3,
        status_id: 2,
        changes: {},
        comment: "Fixed typo in town name",
        created_at: new Date("2024-02-15"),
    },
    {
        id: 3,
        postmark_id: 103,
        user_id: 7,
        status_id: 3,
        changes: {},
        comment: "Incorrect size listed",
        created_at: new Date("2024-03-22"),
    },
];

export const Default: StoryObj<typeof TicketTable> = {
    args: {
        tickets: sampleTickets,
        loading: false,
        onRowClick: (ticket) => alert(`Clicked ticket ${ticket.id}`),
    },
};
