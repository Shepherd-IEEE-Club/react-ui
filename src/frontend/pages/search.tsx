import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PostmarkModal from './postmarkmodal'; // Import the modal

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

const Container = styled.div`
    width: 80rem;
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
    width: 80%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
`;

const StyledTable = styled.table`
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

    th, td {
        border: 1px solid #ddd;
        padding: 0.75rem 1rem;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    thead th {
        position: sticky;
        top: 0;
        background-color: #f4f4f4;
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #f1f1f1;
        cursor: pointer;
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
    const [selectedPostmark, setSelectedPostmark] = useState<Postmark | null>(null);

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    // const [postmarks, setPostmarks] = useState<Postmark[]>([]);
    // const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    // const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    // const [hasMore, setHasMore] = useState(true);

    // Fetch postmarks
    useEffect(() => {
        fetch('http://localhost:3001/api/postmarks?page=1')
            .then(res => res.json())
            .then(data => setPostmarks(data.data))
            .catch(err => console.error('Error fetching postmarks:', err));
    }, []);

    // Filtered postmarks
    const filteredPostmarks = postmarks.filter(pm =>
        pm.postmark.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pm.town.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pm.state.toLowerCase().includes(searchTerm.toLowerCase())
    );


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

    return (
        <Container onScroll={handleScroll}>
            <Title>Postmarks</Title>
            <SearchInput
                type="text"
                placeholder="Search postmarks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <StyledTable>
                <thead>
                <tr>
                    <th>Image</th>
                    <th>Postmark</th>
                    <th>Town</th>
                    <th>State</th>
                </tr>
                </thead>
                <tbody>
                {filteredPostmarks.map(pm => (
                    <tr key={pm.id} onClick={() => setSelectedPostmark(pm)}>
                        <td><Image src={`data:image/jpeg;base64,${pm.image}`} alt={pm.postmark} /></td>
                        <td>{pm.postmark}</td>
                        <td>{pm.town}</td>
                        <td>{pm.state}</td>
                    </tr>
                ))}
                </tbody>
            </StyledTable>

            {selectedPostmark && (
                <PostmarkModal postmark={selectedPostmark} onClose={() => setSelectedPostmark(null)} />
            )}
        </Container>
    );
};

export default PostmarksList;
