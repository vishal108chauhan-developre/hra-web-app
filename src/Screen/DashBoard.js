import React, { useCallback, useEffect, useState } from 'react';
import LeaveCard from '../Component/LeaveCard';
import { url } from '../Baseurl';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import '../Css/DashboardScreen.css';

export default function DashboardScreen() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState("");
    const [deparmentuser, setDepartmentUser] = useState([]);
    // const [alluser, setAllUser] = useState([]);

    const navigate = useNavigate(); // ✅ Initialize navigate here

    const fetchLeaves = useCallback(async () => {
        setLoading(true);
        try {
            // const userCode = localStorage.getItem("userCode");
            const username = localStorage.getItem("role");

            setAdmin(username);

            const token = localStorage.getItem("U_Token");
            const response = await fetch(`${url}assigned-leaves`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();
            console.log(data)
            setLeaves(data); // Assuming you maintain a leaves state
        } catch (err) {
            console.error('Failed to fetch leaves:', err);
            setLeaves([]);
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchLeaves();
        userdeparment();
        // uerAll();
    }, [fetchLeaves]);


    const userdeparment = async () => {
        // const userCode = localStorage.getItem("userCode");
        const username = localStorage.getItem("role");
        const managerId = localStorage.getItem("managerId");
        // const token = localStorage.getItem("U_Token");
        const res = await fetch(`http://192.168.12.181:8000/employee?role=${username}&managerId=${managerId}`);
        const result = await res.json()
        console.log(result)
        setDepartmentUser(result)
    }


    // const uerAll = async () => {
    //     const res = await fetch(`https://aewsmart.com/aew-shiv/aew-rating-app/`);
    //     const result = await res.json()
    //     console.log(result)
    //     setAllUser(result)
    // }
    return (

        <div className="user-card-container" >
            <div className="user-card" onClick={() => navigate('/Leave')}>
                <p className="user-name">Leave</p>
                <p className="user-info">📧item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
                {/* <p className={`user-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
                        {item.status}
                    </p> */}
            </div>


            <div className="user-card" onClick={() => navigate('/AssinnAssest')}>
                <p className="user-name">Assest</p>
                <p className="user-info">📧item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
                {/* <p className={`user-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
                        {item.status}
                    </p> */}
            </div>




            <div className="user-card" onClick={() => navigate('/ReviewForm')}>
                <p className="user-name">Review</p>
                <p className="user-info">📧item.email</p>
                <p className="user-info">📞 item.role</p>
                <p className="user-info">💼 item.department</p>
                {/* <p className={`user-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
                        {item.status}
                    </p> */}
            </div>
        </div>


        // <div style={styles.container}>







        //     {admin !== "manager" && (
        //         <div style={styles.buttonRow}>
        //             <button
        //                 style={{ ...styles.updateBtn, backgroundColor: 'green' }}
        //                 onClick={() => navigate('/Add')} // ✅ No error now
        //             >
        //                 Add Leave
        //             </button>
        //         </div>
        //     )}

        //     {loading ? (
        //         <p>Loading...</p>
        //     ) : (
        //         <div style={{ marginTop: '20px' }}>
        //             {Array.isArray(leaves) && leaves.length > 0 ? (
        //                 leaves.map((item) => (
        //                     <LeaveCard
        //                         key={item._id}
        //                         leave={item}
        //                         onUpdateStatus={fetchLeaves}
        //                         admin={admin}
        //                     />
        //                 ))
        //             ) : (
        //                 <p>No leave records found.</p>
        //             )}



        //             <h1>deparmentuser </h1>
        //             <div className="user-card-container" onClick={() => navigate('/ReviewForm')}>
        //                 {Array.isArray(deparmentuser) && deparmentuser.length > 0 ? (
        //                     deparmentuser.map((item) => (
        //                         <div key={item._id} className="user-card">
        //                             <p className="user-name">{item.name}</p>
        //                             <p className="user-info">📧 {item.email}</p>
        //                             <p className="user-info">📞 {item.role}</p>
        //                             <p className="user-info">💼 {item.department}</p>
        //                             {/* <p className={`user-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
        //                             {item.status}
        //                         </p> */}
        //                         </div>

        //                     ))
        //                 ) : (
        //                     <p>No deparmentuser records found.</p>
        //                 )}
        //             </div>


        //             <h1>All User  </h1>
        //             {/* <div className="user-card-container">
        //                 {Array.isArray(alluser) && alluser.length > 0 ? (
        //                     alluser.map((item) => (
        //                         <div key={item.emp_id} className="user-card" onClick={() => navigate('/ReviewForm')}>
        //                             <p className="user-name">{item.first_name}</p>
        //                             <p className="user-info">📧 {item.email}</p>
        //                             <p className="user-info">📞 {item.phone}</p>
        //                             <p className="user-info">💼 {item.job_title}</p>
        //                             <p className={`user-status ${item.status === 'active' ? 'active' : 'inactive'}`}>
        //                                 {item.status}
        //                             </p>
        //                         </div>
        //                     ))
        //                 ) : (
        //                     <p className="no-user">No alluser user records found.</p>
        //                 )}
        //             </div> */}


        //         </div>
        //     )}


        // </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial',
    },
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
    contentRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        flexWrap: 'wrap',
        backgroundColor: 'red'
    },
};
