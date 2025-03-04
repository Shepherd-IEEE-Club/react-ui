import './search.css';

// @ts-ignore
import React, { useState, useEffect } from 'react';
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

// Styled components
const Container = styled.div`
    max-width: 1000px;
    margin: 2rem auto;
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    thead {
        background-color: #f4f4f4;
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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/postmarks')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data && Array.isArray(data.data)) {
                    setPostmarks(data.data);
                } else {
                    throw new Error('Unexpected data shape: ' + JSON.stringify(data));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching postmarks:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

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
        <Container>
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
                    <th>ID</th>
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
                        <td>{pm.id}</td>
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
        </Container>
    );
};

export default PostmarksList;
