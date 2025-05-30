import React, {useState} from "react";
import {trpc} from "@woco/web/trpc";
import type {Ticket} from "@woco/schema/ticket";
import TicketTable from "./table";
import TicketModal from "@woco/web/pages/Ticket/Modal";
import {PostmarkSchema} from "@woco/schema/postmark.ts";

const SubmitterView: React.FC = () => {
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    const {data, isLoading, error} = trpc.tickets.mine.useQuery({
        user_id: 1,
        limit: 10000,
    });

    // FIXME should blow up
    const tickets = data?.tickets ?? [];
    const postmarks = data?.postmarks ?? {};

    const {data: images} = trpc.postmarks.images.useQuery(
        {postmark_id: selectedTicket?.postmark_id ?? -1},
        {
            enabled: !!selectedTicket, // only fetch when ticket is selected
        }
    );

    return (
        <div style={{width: "100%", height: "100%", overflowY: "auto"}}>
            <TicketTable
                tickets={tickets}
                postmarks={postmarks}
                onRowClick={setSelectedTicket}
                loading={isLoading}
            />

            {/* {selectedTicket && (
                <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
            )} */}

            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    postmark={
                        // convert to what modal wants
                        // get rid of thumbnail etc etc
                        // TODO maybe make special zod for this
                        PostmarkSchema.parse(
                            postmarks[selectedTicket.postmark_id]
                        )
                    }
                    images={images ?? []}
                    onClose={() => setSelectedTicket(null)}
                />
            )}


            {error && <p style={{color: "red"}}>{(error as Error).message}</p>}
        </div>
    );
};

export default SubmitterView;
