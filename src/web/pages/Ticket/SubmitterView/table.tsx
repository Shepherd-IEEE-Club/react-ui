import React from "react";
import type {Ticket} from "@woco/schema/ticket";
import {StyledTable} from "@woco/web/style.ts";
import {TICKET_STATUS_LABELS} from "@woco/web/constants.ts";
import type {PostmarkSchema} from "@woco/schema/postmark.ts";
import {z} from "zod";

interface Props {
    tickets: Ticket[];
    // map of relevant postmarks
    postmarks: Record<number, z.infer<typeof PostmarkSchema.withThumbnail>>;
    loading?: boolean;
    onRowClick: (ticket: Ticket) => void;
}


const TicketTable: React.FC<Props> = ({tickets, postmarks, loading, onRowClick}) => {
    return (
        <StyledTable>
            <thead>
            <tr>
                <th>ID</th>
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
                    const thumbnail = postmark?.images?.[0]?.thumbnail;

                    return (
                        <tr key={ticket.id} onClick={() => onRowClick(ticket)}>
                            <td>
                                {thumbnail ? (
                                    <img
                                        src={`data:image/jpeg;base64,${thumbnail}`}
                                        alt="thumb"
                                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
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
