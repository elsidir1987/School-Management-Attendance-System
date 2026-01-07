import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    // Login.js
    const onFinish = async (values) => {
        // Χρησιμοποιούμε URLSearchParams για να στείλουμε τα δεδομένα ως "application/x-www-form-urlencoded"
        const params = new URLSearchParams();
        params.append('username', values.username);
        params.append('password', values.password);

        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', params);

            if (response.status === 200) {
                message.success("Επιτυχής σύνδεση!");
                onLoginSuccess(); // Αυτό θα καλέσει το App.js να τρέξει το /api/auth/me
            }
        } catch (error) {
            console.log("Error details:", error.response);
            message.error("Λάθος στοιχεία σύνδεσης");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
            <Card title="🏫 Είσοδος στο Σχολικό Σύστημα" style={{ width: 400, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item name="username" label="Email Δασκάλου" rules={[{ required: true, message: 'Παρακαλώ εισάγετε το όνομα χρήστη' }]}>
                        <Input placeholder="π.χ. teacher@school.gr" />
                    </Form.Item>
                    <Form.Item name="password" label="Κωδικός" rules={[{ required: true, message: 'Παρακαλώ εισάγετε τον κωδικό' }]}>
                        <Input.Password placeholder="password" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block size="large" style={{ marginTop: '10px' }}>
                        Σύνδεση
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;