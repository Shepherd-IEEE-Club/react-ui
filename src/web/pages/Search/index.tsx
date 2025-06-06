import React, {useRef, useCallback, useState, useMemo, useEffect} from "react";
import styled from "styled-components";
import { trpc } from "@woco/web/trpc.ts";
import PostmarkModal from "@woco/web/pages/PostmarkModal";
import PostmarksTable from "./table.tsx";
import {Postmark} from "@woco/schema/postmark.ts";
import { trpcClient} from "@woco/web/trpc.ts";
import {modalManager} from "@woco/web/pages/ModalManager.tsx";

//TODO detail modal show thumbnail while its getting real picture from server
// TODO maybe get every postmark, then lazy load thumbnails?

/** Pagination page size */
const PAGE_SIZE = 50;

/* ---------- styled‑components ---------- */
const Container = styled.div`
    width: 80rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    position: relative;
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: #333;
`;

const SearchInput = styled.input`
    display: block;
    width: 80%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const FilterContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: space-evenly;
`;

const FilterInput = styled.input`
  width: 7rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    &:hover {
        background-color: #0056b3;
    }
`;

/* ---------- component ---------- */
const Search: React.FC = () => {

    /* UI state */
    // const [selectedPostmark, setSelectedPostmark] = useState<Postmark | null>(null);
    const [filters, setFilters] = useState<{
        startYear?: number;
        endYear?: number;
        state?: string;
        town?: string;
        searchTerm?: string;
    }>({});
    const [appliedFilters, setAppliedFilters] = useState<typeof filters>({});

    /* infinite query */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
    } = trpc.postmarks.infinite.useInfiniteQuery(
        { limit: PAGE_SIZE, ...appliedFilters },

        {
            getNextPageParam: (last) => last.nextCursor ?? undefined,
            // keepPreviousData: true,
        }
    );

    const [postmarks, setPostmarks] = useState<Postmark[]>([]);


    // Update postmarks state when data changes
    useEffect(() => {
        if (!data?.pages) return;
        const newPostmarks = data.pages.flatMap(p => p.items);
        if (newPostmarks.length !== postmarks.length) {
            setPostmarks(newPostmarks);
        }
    }, [data]);

    const [selectedPostmark, setSelectedPostmark] = useState<Postmark | null>(null);


    /* infinite‑scroll handler */
    const containerRef = useRef<HTMLDivElement>(null);
    const handleScroll = useCallback(
        (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
            if (
                scrollTop + clientHeight + 100 >= scrollHeight &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        },
        [hasNextPage, isFetchingNextPage, fetchNextPage]
    );

    /* actions */
    const applyFilters = () => setAppliedFilters(filters);

    /* render */
    return (
        <Container ref={containerRef} onScroll={handleScroll}>
            <Title>Postmarks</Title>

            {/* Filters */}
            <FilterContainer>
                <label>
                    State
                    <FilterInput
                        type="text"
                        placeholder="Enter state"
                        value={filters.state ?? ""}
                        onChange={(e) => setFilters({ ...filters, state: e.target.value || undefined })}
                    />
                </label>
                <label>
                    Town
                    <FilterInput
                        type="text"
                        placeholder="Enter town"
                        value={filters.town ?? ""}
                        onChange={(e) => setFilters({ ...filters, town: e.target.value || undefined })}
                    />
                </label>
                <label>
                    Begin Year
                    <FilterInput
                        type="number"
                        placeholder="Start Year"
                        value={filters.startYear ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                startYear: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                    />
                </label>
                <label>
                    End Year
                    <FilterInput
                        type="number"
                        placeholder="End Year"
                        value={filters.endYear ?? ""}
                        onChange={(e) =>
                            setFilters({
                                ...filters,
                                endYear: e.target.value ? Number(e.target.value) : undefined,
                            })
                        }
                    />
                </label>

                <Button onClick={applyFilters}>Apply Filters</Button>
            </FilterContainer>

            {/* Full‑text search */}
            <SearchInput
                type="text"
                placeholder="Index postmarks…"
                value={filters.searchTerm ?? ""}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value || undefined })}
            />

            {/* table */}
            <PostmarksTable
                postmarks={postmarks}
                onRowClick={(postmark) =>
                    modalManager.push(
                        <PostmarkModal
                            postmark={postmark}

                            imageMapPromise={trpcClient.postmarks.images.query({ id: postmark.id })}
                            onClose={() => setSelectedPostmark(null)}
                        />
                    )
                }
                loading={isLoading}
            />




            {/* load‑more marker for screen‑readers / debug */}
            {isFetchingNextPage && <p style={{ margin: "1rem" }}>Loading more…</p>}
        </Container>
    );
};

export default Search;


//TODO infinite scroll does not work when viewing search indivdiaully in storybook
// FIXME filtering fucked up
// TODO clear on filter form change