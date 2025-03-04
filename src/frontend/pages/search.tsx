import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';



interface Postmark {
    id: number;
    image: string;
    postmark: string;
    town: string;
    state: string;
    date_seen?: string;
    size?: string;
    colors?: string;
}

// const ContentContainer = styled.div`
//     //padding: 1rem;
//     //width: inherit;
//     //display: flex;
//     //flex-direction: column;
//     //align-items: center;
//     overflow-y: auto;
//     height: 100%;
//     //height: auto;
// `;

const Container = styled.div`
    width: 100vh;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
`;

const Title = styled.h2`
    text-align: center;
    font-size: 1.75rem;
    margin-bottom: 1rem;
    color: #333;
`;

const SearchInput = styled.input`
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    th,
    td {
        border: 1px solid #ddd;
        padding: 0.75rem 1rem;
        text-align: left;
    }

    thead th {
        position: sticky;
        top: 0;
        background-color: #f4f4f4; /* Keeps header background visible */
        z-index: 10000000; /* Ensures the header stays above table rows */
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
    }
`;


const Image = styled.img`
    max-width: 80px;
    max-height: 80px;
    border-radius: 4px;
`;

const Message = styled.div<{ error?: boolean }>`
    text-align: center;
    margin-top: 2rem;
    font-size: 1.25rem;
    color: ${({ error }) => (error ? '#d9534f' : '#555')};
`;

const PostmarksList: React.FC = () => {
    const [postmarks, setPostmarks] = useState<Postmark[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Function to fetch postmarks for a given page
    const fetchPostmarks = useCallback(
        (pageNumber: number) => {
            // Adjust the URL based on how your API handles pagination.
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

    // Initial load
    useEffect(() => {
        fetchPostmarks(1)
            .then(data => {
                setPostmarks(data);
                setLoading(false);
                if (data.length === 0) {
                    setHasMore(false);
                }
            })
            .catch(err => {
                console.error("Error fetching postmarks:", err);
                setError(err.message);
                setLoading(false);
            });
    }, [fetchPostmarks]);

    // Function to load more entries
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
                console.error("Error loading more postmarks:", err);
                setError(err.message);
                setLoadingMore(false);
            });
    }, [fetchPostmarks, hasMore, loadingMore, page]);

    // Scroll event listener to trigger load more
    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;
        if (scrollTop + clientHeight + 100 >= scrollHeight && hasMore) {
            loadMore();
        }
    };



    // Filter the postmarks based on the search term.
    const filteredPostmarks = postmarks.filter(pm => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
            pm.postmark.toLowerCase().includes(lowerSearch) ||
            pm.town.toLowerCase().includes(lowerSearch) ||
            pm.state.toLowerCase().includes(lowerSearch)
        );
    });

    if (loading) {
        return <Message>Loading postmarks...</Message>;
    }

    if (error) {
        return <Message error>Error: {error}</Message>;
    }


    return (
        <Container onScroll={handleScroll}>
            {/*<ContentContainer>*/}
                <Title>Postmarks</Title>
                <SearchInput
                    type="text"
                    placeholder="Search postmarks..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <StyledTable >
                    <thead>
                    <tr>
                        <th>Image</th>
                        <th>Postmark</th>
                        <th>Town</th>
                        <th>State</th>
                        <th>Date Seen</th>
                        <th>Size</th>
                        <th>Colors</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPostmarks.map(pm => (
                        <tr key={pm.id}>
                            <td>
                                <Image src={`data:image/jpeg;base64,${pm.image}`} alt={pm.postmark} />
                            </td>
                            <td>{pm.postmark}</td>
                            <td>{pm.town}</td>
                            <td>{pm.state}</td>
                            <td>{pm.date_seen}</td>
                            <td>{pm.size}</td>
                            <td>{pm.colors}</td>
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
                {loadingMore && <Message>Loading more postmarks...</Message>}
            {/*</ContentContainer>*/}
        </Container>
    );
};

export default PostmarksList;
