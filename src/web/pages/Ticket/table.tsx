import React from "react";
import type {Ticket} from "@woco/schema/ticket";
import {StyledTable} from "@woco/web/style.ts";
import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";
import {PostmarkTableRowSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";


interface FilterButtonsProps<T extends string | number> {
    value: T;
    onChange: (val: T) => void;
    options: { label: string; value: T }[];
}

export const FilterButtons = <T extends string | number>(
    {
        value,
        onChange,
        options,
    }: FilterButtonsProps<T>) => (

    <div style={{display: "flex", gap: "0.5rem", margin: "1rem 0"}}>
        {options.map(({label, value: v}) => (
            <button
                key={label}
                onClick={() => onChange(v)}
                style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    backgroundColor: value === v ? "#007bff" : "#f0f0f0",
                    color: value === v ? "white" : "black",
                    cursor: "pointer",
                }}
            >
                {label}
            </button>
        ))}
    </div>
);


interface Props {
    tickets: Ticket[];
    // map of relevant postmarks
    postmarks: Record<number, z.infer<typeof PostmarkTableRowSchema>>;
    loading?: boolean;
    onRowClick: (ticket: Ticket) => void;
}

const TicketTable: React.FC<Props> = ({tickets, postmarks, loading, onRowClick}) => {
    return (
        <StyledTable>
            <thead>
            <tr>
                <th>Image</th>
                <th>Status</th>
                <th>Postmark</th>
                <th>User</th>
                <th>Comment</th>
                <th>Created</th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                    <td colSpan={6}>Loading…</td>
                </tr>
            ) : (
                tickets.map((ticket) => {
                    console.log(postmarks)
                    const postmark = postmarks[ticket.postmark_id];

                    return (
                        <tr key={ticket.id} onClick={() => onRowClick(ticket)}>
                            <td>
                                {postmark.thumbnail ? (
                                    <img
                                        src={`data:image/jpeg;base64,${postmark.thumbnail}`}
                                        alt="thumb"
                                        style={{width: 40, height: 40, objectFit: "cover", borderRadius: 4}}
                                    />
                                ) : (
                                    "—"
                                )}
                            </td>
                            <td>{TICKET_STATUS_LABELS[ticket.status_id]}</td>
                            <td>{postmark?.postmark ?? ticket.postmark_id}</td>
                            <td>{ticket.user_id}</td>
                            <td>{ticket.comment?.slice(0, 30) || "—"}</td>
                            <td>{new Date(ticket.created_at).toLocaleDateString()}</td>
                        </tr>
                    );
                })
            )}
            </tbody>
        </StyledTable>
    );
};

export default TicketTable;
