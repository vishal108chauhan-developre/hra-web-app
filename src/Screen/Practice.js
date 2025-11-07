import React, { useState } from 'react';


function Practice() {
    const [image, setImage] = useState('');
    console.log(image)

    function convertToBase64(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 300; // adjust this to control dimensions
                const scaleSize = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scaleSize;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Try to compress to base64 with quality reducing
                let quality = 0.9;
                let base64 = '';
                do {
                    base64 = canvas.toDataURL('image/jpeg', quality);
                    quality -= 0.05;
                } while (base64.length > 40 * 1024 && quality > 0.1); // stop if under 40KB or quality too low

                console.log('Final base64 size:', Math.round(base64.length / 1024), 'KB');
                setImage(base64);
            };

            img.onerror = (err) => {
                console.error('Image load error', err);
            };
        };

        reader.onerror = (error) => {
            console.log('Error reading file:', error);
        };
    }


    function uploadImage() {
        const token = localStorage.getItem("U_Token");
        fetch('http://localhost:8000/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ base64: image })
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((error) => console.error("Upload failed:", error));
    }








    return (
        <div>

            <p>Let's Upload Image</p>
            <input
                accept="image/*" // ✅ FIXED: "image" → "image/*"
                type="file"
                onChange={convertToBase64}
            />
            {image && (
                <img width={100} height={100} src={image} alt="Preview" />
            )}
            <button onClick={uploadImage}>Upload</button>
        </div>
    );
}

export default Practice;






