import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import TicketModal from "./Detail.tsx";
import type { Ticket } from "@woco/schema/ticket.ts";
import type { z } from "zod";
import type { PostmarkSchema, PostmarkImageSchema } from "@woco/schema/postmark.ts";
import { PostmarkSchema as RealPostmarkSchema } from "@woco/schema/postmark.ts";
import sampleImage from './mock.png';

const toBase64 = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
    });
};

// Inside a React component or setup function:
const base64Image = await toBase64(sampleImage);


// Dummy data
const postmark: z.infer<typeof PostmarkSchema> = {
    id: 1,
    postmark: "Sample PM",
    town: "Sampletown",
    state: "WV",
    date_seen: "1920-05-01",
    size: "medium",
    colors: "black on white",
};

const ticket: Ticket = {
    id: 42,
    user_id: 1,
    postmark_id: 1,
    status_id: 2,
    comment: "Proposed changes to town and colors.",
    created_at: new Date().toISOString(),
    changes: {
        town: "Newtown",
        colors: "red and blue",
        remove_images: [2],
    },
};

const images: Record<number, z.infer<typeof PostmarkImageSchema>> = {
    1: {
        id: 1,
        postmark_id: 1,
        ticket_id: null,
        data: base64Image.split(",")[1], // Replace with a real base64-encoded image string
    },
    2: {
        id: 2,
        postmark_id: 1,
        ticket_id: null,
        data: base64Image.split(",")[1],
    },
    3: {
        id: 3,
        postmark_id: null,
        ticket_id: 42,
        data: base64Image.split(",")[1],
    },
};

const Wrapper = () => {
    const [open, setOpen] = useState(true);

    return (
        <>
            <button onClick={() => setOpen(true)}>Show Modal</button>
    {open && (
        <TicketModal
            ticket={ticket}
        postmark={postmark}
        images={images}
        onClose={() => setOpen(false)}
        />
    )}
    </>
);
};

const meta: Meta<typeof TicketModal> = {
    title: "Modals/TicketModal",
    component: TicketModal,
};

export default meta;

export const Default: StoryObj<typeof TicketModal> = {
    render: () => <Wrapper />,
};
