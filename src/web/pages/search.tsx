import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import PostmarkModal from './postmarkmodal';
import PostmarksTable from './table';

interface Postmark {
    id: number;
    image: string;
    postmark: string;
    town: string;
    state: string;
    date_seen?: string;
}

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

// FIXME made of candy
const FilterContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 3 items per row */
    //flex-wrap: wrap;
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

// TODO global button
//TODO global textbox
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

const FilterButton = styled(Button)`

`;

const BackToTopButton = styled(Button)<{ visible: boolean }>`
    position: sticky;
    bottom: 1rem;
    right: 1rem;
    margin-left: auto;
    padding: 0.75rem;
`;

const FilterLabel = styled.label`
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
`;

const FilterCheckbox = styled.input.attrs({ type: "checkbox" })`
    margin-right: 5px;
`;


const PostmarksList: React.FC = () => {
    const [postmarks, setPostmarks] = useState<Postmark[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPostmark, setSelectedPostmark] = useState<Postmark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [query, setQuery] = useState<{ startYear?: number; endYear?: number }>({});
    const [appliedQuery, setAppliedQuery] = useState<{ startYear?: number; endYear?: number }>({});
    const [showBackToTop, setShowBackToTop] = useState(false);

    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        fetch(`http://localhost:3001/api/postmarks?page=1`)
            .then(res => res.json())
            .then(data => setPostmarks(data.data))
            .catch(err => setError('Error fetching postmarks: ' + err.message));
    }, []);

    const fetchPostmarks = useCallback(
        (pageNumber: number) => {
            return fetch(`http://localhost:3001/api/postmarks?page=${pageNumber}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && Array.isArray(data.data)) {
                        return data.data as Postmark[];
                    } else {
                        throw new Error('Unexpected data shape: ' + JSON.stringify(data));
                    }
                });
        },
        []
    );




    const loadMore = useCallback(() => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        fetchPostmarks(page + 1)
            .then(newData => {
                if (newData.length === 0) {
                    setHasMore(false);
                } else {
                    setPostmarks(prev => [...prev, ...newData]);
                    setPage(prev => prev + 1);
                }
                setLoadingMore(false);
            })
            .catch(err => {
                setError(err.message);
                setLoadingMore(false);
            });
    }, [fetchPostmarks, hasMore, loadingMore, page]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollTop + clientHeight + 100 >= scrollHeight && hasMore) {
            loadMore();
        }
        setShowBackToTop(scrollTop > 200); // Show button when scrolled down
    };

    const scrollToTop = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const applyFilters = () => {
        setAppliedQuery(query);
    };


    return (
        <Container ref={containerRef} onScroll={handleScroll}>
            <Title>Postmarks</Title>


            {/*TODO this ought to be its own file */}
            <FilterContainer>
                <FilterLabel>State</FilterLabel>
                <FilterInput type="text" placeholder="Enter state" />

                <FilterLabel>Town</FilterLabel>
                <FilterInput type="text" placeholder="Enter town" />

                <FilterLabel>Begin Year</FilterLabel>
                <FilterInput
                    type="number"
                    placeholder="Start Year"
                    value={query.startYear || '1700'}
                    onChange={e => setQuery({ ...query, startYear: e.target.value ? parseInt(e.target.value) : undefined })}
                />

                <FilterLabel>End Year</FilterLabel>
                <FilterInput
                    type="number"
                    placeholder="End Year"
                    value={query.endYear || '1850'}
                    onChange={e => setQuery({ ...query, endYear: e.target.value ? parseInt(e.target.value) : undefined })}
                />

                <FilterLabel>Type</FilterLabel>
                <FilterInput type="text" placeholder="Enter type" />

                <FilterLabel>Color</FilterLabel>
                <FilterInput type="text" placeholder="Enter color" />

                <FilterLabel>
                    <FilterCheckbox type="checkbox" /> Include Manuscripts
                </FilterLabel>

                <FilterLabel>
                    <FilterCheckbox type="checkbox" /> Images Only
                </FilterLabel>

                <FilterButton onClick={applyFilters}>Apply Filters</FilterButton>
            </FilterContainer>



            <SearchInput
                type="text"
                placeholder="Search postmarks..."
                value={query.searchTerm || ''}
                onChange={e => setQuery({ ...query, searchTerm: e.target.value })}
            />




            <PostmarksTable postmarks={postmarks} onRowClick={setSelectedPostmark} query={appliedQuery} />

            {selectedPostmark && <PostmarkModal postmark={selectedPostmark} onClose={() => setSelectedPostmark(null)} />}

            <BackToTopButton visible={showBackToTop} onClick={scrollToTop}>↑Back to top</BackToTopButton>
        </Container>
    );
};

export default PostmarksList;
