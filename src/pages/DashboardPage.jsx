import React from 'react';
import { Card, Table } from 'react-bootstrap';

const DashboardPage = () => {
    const stats = {
        analyzedWebsites: 150,
        trackedKeywords: 75,
        seoTraffic: '2000 visits',
        aiOptimizations: 25
    };

    const recentAnalyses = [
        { id: 1, url: 'example1.com', date: '2026-03-10', result: 'Passed' },
        { id: 2, url: 'example2.com', date: '2026-03-09', result: 'Needs Improvement' },
        { id: 3, url: 'example3.com', date: '2026-03-08', result: 'Passed' },
    ];

    return (
        <div>
            <h1>User Dashboard</h1>
            <div className="stats-cards">
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Analyzed Websites</Card.Title>
                        <Card.Text>{stats.analyzedWebsites}</Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>Tracked Keywords</Card.Title>
                        <Card.Text>{stats.trackedKeywords}</Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>SEO Traffic</Card.Title>
                        <Card.Text>{stats.seoTraffic}</Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        <Card.Title>AI Optimizations</Card.Title>
                        <Card.Text>{stats.aiOptimizations}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <h2>Recent Analyses</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Website</th>
                        <th>Date</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {recentAnalyses.map(analysis => (
                        <tr key={analysis.id}>
                            <td>{analysis.id}</td>
                            <td>{analysis.url}</td>
                            <td>{analysis.date}</td>
                            <td>{analysis.result}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DashboardPage;