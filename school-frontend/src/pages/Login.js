import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import axios from 'axios';

/**
 * Component: Login
 * Σκοπός: Παρέχει τη διεπαφή σύνδεσης (Login Interface) για τους χρήστες.
 * Διαχειρίζεται την ταυτοποίηση (Authentication) επικοινωνώντας με το Spring Security στο Backend.
 * * @param {Function} onLoginSuccess - Callback συνάρτηση που ενημερώνει το κεντρικό App.js
 * ότι ο χρήστης συνδέθηκε επιτυχώς, ώστε να αλλάξει το view.
 */
const Login = ({ onLoginSuccess }) => {

    /**
     * Συνάρτηση onFinish:
     * Καλείται αυτόματα από τη φόρμα της Ant Design όταν ο χρήστης πατήσει το κουμπί "Σύνδεση"
     * και αφού περάσουν επιτυχώς οι κανόνες (validation).
     * * @param {Object} values - Περιέχει τα δεδομένα της φόρμας { username, password }.
     */
    const onFinish = async (values) => {

        /* ΣΗΜΑΝΤΙΚΗ ΤΕΧΝΙΚΗ: URLSearchParams
           Το Spring Security από προεπιλογή περιμένει τα δεδομένα σύνδεσης σε μορφή
           "application/x-www-form-urlencoded" και όχι ως JSON.
           Με το URLSearchParams μετατρέπουμε το object σε αυτή τη μορφή.
        */
        const params = new URLSearchParams();
        params.append('username', values.username);
        params.append('password', values.password);

        try {
            // Αποστολή αιτήματος POST στο Endpoint ταυτοποίησης
            const response = await axios.post('http://localhost:8080/api/auth/login', params);

            // Αν ο Server απαντήσει με 200 OK, η σύνδεση είναι έγκυρη
            if (response.status === 200) {
                message.success("Επιτυχής σύνδεση!");

                /* Ενημέρωση του Parent Component (App.js).
                   Συνήθως εκεί εκτελείται ένα follow-up call στο /api/auth/me
                   για να πάρουμε τις λεπτομέρειες του προφίλ του χρήστη.
                */
                onLoginSuccess();
            }
        } catch (error) {
            // Σε περίπτωση λάθους (π.χ. 401 Unauthorized), ενημερώνουμε τον χρήστη
            console.log("Σφάλμα σύνδεσης:", error.response);
            message.error("Λάθος στοιχεία σύνδεσης. Παρακαλώ δοκιμάστε ξανά.");
        }
    };

    return (
        /* Κεντράρισμα της κάρτας Login στην οθόνη με Flexbox */
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: '#f0f2f5'
        }}>
            {/* Κάρτα Εισόδου με σκιές και στρογγυλεμένες γωνίες για μοντέρνο UI */}
            <Card
                title="🏫 Είσοδος στο Σχολικό Σύστημα"
                style={{ width: 400, borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    {/* Πεδίο Username/Email με κανόνες εγκυρότητας */}
                    <Form.Item
                        name="username"
                        label="Email Δασκάλου"
                        rules={[{ required: true, message: 'Παρακαλώ εισάγετε το email σας' }]}
                    >
                        <Input placeholder="π.χ. teacher@school.gr" />
                    </Form.Item>

                    {/* Πεδίο Password με δυνατότητα απόκρυψης/εμφάνισης χαρακτήρων */}
                    <Form.Item
                        name="password"
                        label="Κωδικός"
                        rules={[{ required: true, message: 'Παρακαλώ εισάγετε τον κωδικό σας' }]}
                    >
                        <Input.Password placeholder="password" />
                    </Form.Item>

                    {/* Κουμπί Submit που καλύπτει όλο το πλάτος (block) */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        style={{ marginTop: '10px' }}
                    >
                        Σύνδεση
                    </Button>
                </Form>
            </Card>
        </div>
    );
};

export default Login;