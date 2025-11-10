import React, { useCallback, useEffect, useState } from 'react';
import LeaveCard from '../Component/LeaveCard';
import { url } from '../Baseurl';
import { useNavigate } from 'react-router-dom';
import '../Css/DashboardScreen.css';

export default function Leave() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState('');
    const navigate = useNavigate();

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            const role = localStorage.getItem('role');
            setAdmin(role);

            const token = localStorage.getItem('U_Token');
            const response = await fetch(`${url}/assigned-leaves`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch leaves');
            const data = await response.json();
            setLeaves(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch leaves:', err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeaves();
    }, [fetchLeaves]);

    return (
        <div style={styles.container}>
            {admin !== 'manager' && (
                <div style={styles.buttonRow}>
                    <button
                        style={{ ...styles.updateBtn, backgroundColor: 'green' }}
                        onClick={() => navigate('/Add')}
                    >
                        Add Leave
                    </button>
                </div>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ marginTop: '20px' }}>
                    {leaves.length > 0 ? (
                        leaves.map((item) => (
                            <LeaveCard
                                key={item._id}
                                leave={item}
                                onUpdateStatus={fetchLeaves}
                                admin={admin}
                            />
                        ))
                    ) : (
                        <p>No leave records found.</p>
                    )}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: { padding: '20px', fontFamily: 'Arial' },
    buttonRow: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginTop: '12px',
    },
    updateBtn: {
        padding: '10px 15px',
        color: 'white',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        marginRight: '10px',
    },
};
