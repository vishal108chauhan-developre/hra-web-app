import React, { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Modal from "./Modal";
import "../Css/ReviewFormModal.css";

const url = "http://localhost:8000";

export default function ReviewFormModal({ open, onClose, onSuccess }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        employeeId: "",
        reviewMonth: "",
        ratings: []
    });

    /* ================= LOAD EMPLOYEES ================= */
    useEffect(() => {
        if (!open) return;

        async function fetchEmployees() {
            try {
                const token = localStorage.getItem("U_Token");
                const res = await axios.get(`${url}/api/manager-employees`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployees(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to load employees");
            }
        }

        fetchEmployees();
    }, [open]);

    /* ================= HELPER ================= */
    const formatReviewPeriod = (monthStr) => {
        if (!monthStr) return "";
        const d = new Date(monthStr + "-01");
        return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    };

    /* ================= KPA HANDLERS ================= */
    const addKPA = () => {
        const newKPA = { id: uuidv4(), title: "", responsibility: "" };
        setFormData(prev => ({
            ...prev,
            ratings: [...prev.ratings, newKPA]
        }));
    };

    const updateKPA = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            ratings: prev.ratings.map(kpa =>
                kpa.id === id ? { ...kpa, [field]: value } : kpa
            )
        }));
    };

    const removeKPA = (id) => {
        setFormData(prev => ({
            ...prev,
            ratings: prev.ratings.filter(kpa => kpa.id !== id)
        }));
    };

    /* ================= SUBMIT ================= */
    const submit = async () => {
        setError("");

        if (!formData.employeeId) return setError("Select an employee");
        if (!formData.reviewMonth) return setError("Select review month");
        if (!formData.ratings.length) return setError("Add at least one KPA");

        const reviewPeriod = formatReviewPeriod(formData.reviewMonth);

        try {
            setLoading(true);
            const token = localStorage.getItem("U_Token");

            for (const kpa of formData.ratings) {
                await axios.put(
                    `${url}/assign-ratings`,
                    {
                        employeeId: formData.employeeId,
                        reviewPeriod,
                        kpaId: kpa.id,
                        title: kpa.title,
                        responsibility: kpa.responsibility
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            onSuccess?.();
            onClose();
            alert("Ratings submitted successfully!");
        } catch (err) {
            console.error(err);
            setError("Failed to submit ratings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Create Monthly Review">
            <div className="review-form">
                {error && <div className="error-box">{error}</div>}

                {/* Employee + Month + Add KPA in one row */}
                <div className="form-row employee-month-row">
                    <div className="field">
                        <label>Employee</label>
                        <select
                            value={formData.employeeId}
                            disabled={loading}
                            onChange={e =>
                                setFormData(prev => ({ ...prev, employeeId: e.target.value }))
                            }
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp._id} value={emp._id}>
                                    {emp.name} ({emp.employeescode || ""})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label>Review Month</label>
                        <input
                            type="month"
                            value={formData.reviewMonth}
                            disabled={loading}
                            onFocus={e => e.target.showPicker?.()} // Open calendar picker automatically in supported browsers
                            onChange={e =>
                                setFormData(prev => ({ ...prev, reviewMonth: e.target.value }))
                            }
                        />
                    </div>

                    <button
                        className="add-kpa-btn"
                        onClick={addKPA}
                        disabled={loading}
                    >
                        + Add KPA
                    </button>
                </div>

                {/* KPA List with index */}
                {formData.ratings.map((kpa, index) => (
                    <div key={kpa.id} className="kpa-card">
                        <div className="kpa-index">{index + 1}.</div>
                        <input
                            placeholder="KPA Title"
                            value={kpa.title}
                            disabled={loading}
                            onChange={e => updateKPA(kpa.id, "title", e.target.value)}
                        />
                        <textarea
                            placeholder="Responsibility"
                            value={kpa.responsibility}
                            disabled={loading}
                            onChange={e => updateKPA(kpa.id, "responsibility", e.target.value)}
                        />
                        <button
                            className="remove-kpa-btn"
                            onClick={() => removeKPA(kpa.id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    className="submit-btn"
                    onClick={submit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Submit Ratings"}
                </button>
            </div>
        </Modal>
    );
}
