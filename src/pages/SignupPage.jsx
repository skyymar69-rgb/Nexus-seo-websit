import React, { useState } from 'react';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let formErrors = {};
        if (!name) formErrors.name = 'Name is required';
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!/
            ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\$/.test(email)) {
            formErrors.email = 'Email is invalid';
        }
        if (!phone) formErrors.phone = 'Phone number is required';
        if (!password) formErrors.password = 'Password is required';
        return formErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            // Handle successful signup (call API, etc.)
            console.log('Signup successful!');
        }
    };

    return (
        <div>
            <h1>Signup</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </div>
                <div>
                    <label>Phone</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    {errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                </div>
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default SignupPage;