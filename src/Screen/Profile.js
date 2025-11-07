import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../Baseurl'; // example: http://localhost:5000/api/

function ProfileForm() {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        profileimage: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: { lat: '', lng: '' },
        },
        phone: '',
        website: '',
        company: { name: '', catchPhrase: '', bs: '' },
    });

    const [isExistingProfile, setIsExistingProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('U_Token');
        if (!token) {
            setLoading(false);
            return;
        }

        axios
            .get(`${url}api/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => {
                setForm(res.data);
                setIsExistingProfile(true);
            })
            .catch(err => {
                if (err.response?.status === 404) {
                    setIsExistingProfile(false); // no profile found, create new
                    setForm({
                        name: '',
                        username: '',
                        email: '',
                        profileimage: '',
                        address: {
                            street: '',
                            suite: '',
                            city: '',
                            zipcode: '',
                            geo: { lat: '', lng: '' },
                        },
                        phone: '',
                        website: '',
                        company: { name: '', catchPhrase: '', bs: '' },
                    });
                } else {
                    setError('Failed to load profile');
                    console.error(err);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        setForm(prev => {
            const updated = { ...prev };
            let obj = updated;
            keys.forEach((key, i) => {
                if (i === keys.length - 1) obj[key] = value;
                else obj = obj[key];
            });
            return updated;
        });
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 300;
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                let quality = 0.9;
                let base64 = '';
                do {
                    base64 = canvas.toDataURL('image/jpeg', quality);
                    quality -= 0.05;
                } while (base64.length > 40 * 1024 && quality > 0.1);
                setForm(prev => ({ ...prev, profileimage: base64 }));
            };
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('U_Token');
        if (!token) return alert('You must be logged in to submit your profile.');

        try {
            const endpoint = `${url}api/profile`;
            const method = isExistingProfile ? 'put' : 'post';

            await axios({
                method,
                url: endpoint,
                data: form,
                headers: { Authorization: `Bearer ${token}` },
            });

            alert(`Profile ${isExistingProfile ? 'updated' : 'created'} successfully!`);
            setIsExistingProfile(true);
        } catch (err) {
            console.error('Submit failed', err);
            alert('Failed to submit profile');
        }
    };

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <input type="file" accept="image/*" onChange={handleImage} />
            {form.profileimage && <img src={form.profileimage} alt="Preview" width={100} />}
            {/* Address inputs */}
            <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" />
            <input name="address.suite" value={form.address.suite} onChange={handleChange} placeholder="Suite" />
            <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" />
            <input name="address.zipcode" value={form.address.zipcode} onChange={handleChange} placeholder="Zipcode" />
            <input name="address.geo.lat" value={form.address.geo.lat} onChange={handleChange} placeholder="Latitude" />
            <input name="address.geo.lng" value={form.address.geo.lng} onChange={handleChange} placeholder="Longitude" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website" />
            <input name="company.name" value={form.company.name} onChange={handleChange} placeholder="Company Name" />
            <input name="company.catchPhrase" value={form.company.catchPhrase} onChange={handleChange} placeholder="Catch Phrase" />
            <input name="company.bs" value={form.company.bs} onChange={handleChange} placeholder="BS" />

            <button type="submit">{isExistingProfile ? 'Update' : 'Add'} Profile</button>
        </form>
    );
}

export default ProfileForm;
