import React from 'react';
import { Card, Descriptions, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, MailOutlined } from '@ant-design/icons';

/**
 * Component: UserProfile
 * Σκοπός: Εμφάνιση των στοιχείων του συνδεδεμένου χρήστη σε μορφή προφίλ.
 * Χαρακτηριστικά:
 * - Δυναμικό θέμα (Blue για Admin, Green για Teacher).
 * - Χρήση Ant Design Descriptions για καθαρή οργάνωση δεδομένων.
 * @param {Object} user - Το αντικείμενο του χρήστη που περιλαμβάνει username και role.
 */
const UserProfile = ({ user }) => {

    // Έλεγχος ρόλου: Καθορίζει το "θέμα" (χρώματα και δικαιώματα) του προφίλ
    const isAdmin = user.role.includes("ADMIN");

    return (
        <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
            {/* Κύρια Κάρτα Προφίλ με σκιές και στρογγυλεμένες γωνίες */}
            <Card
                style={{ width: 600, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cover={
                    /* Δυναμικό Gradient Background ανάλογα με τον ρόλο */
                    <div style={{
                        height: '120px',
                        background: isAdmin
                            ? 'linear-gradient(90deg, #1890ff, #001529)' // Μπλε θέμα για Admin
                            : 'linear-gradient(90deg, #52c41a, #237804)', // Πράσινο θέμα για Teacher
                        borderRadius: '15px 15px 0 0'
                    }} />
                }
            >
                {/* Ενότητα Avatar και Τίτλου - Χρησιμοποιεί αρνητικό margin για το εφέ επικάλυψης στο cover */}
                <div style={{ textAlign: 'center', marginTop: '-60px' }}>
                    <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: '#fff',
                            color: isAdmin ? '#1890ff' : '#52c41a',
                            border: '4px solid #fff'
                        }}
                    />
                    <h2 style={{ marginTop: '10px' }}>{user.username}</h2>

                    {/* Badge Ρόλου: Gold για Διευθυντές, Green για Εκπαιδευτικούς */}
                    <Tag color={isAdmin ? 'gold' : 'green'} icon={<SafetyCertificateOutlined />}>
                        {isAdmin ? "ΔΙΕΥΘΥΝΤΗΣ" : "ΕΚΠΑΙΔΕΥΤΙΚΟΣ"}
                    </Tag>
                </div>

                <Divider />

                {/* Πίνακας Λεπτομερειών: Χρησιμοποιεί το bordered στυλ για επαγγελματική εμφάνιση */}
                <Descriptions title="Πληροφορίες Λογαριασμού" column={1} bordered>
                    <Descriptions.Item label={<span><UserOutlined /> Όνομα Χρήστη</span>}>
                        {user.username}
                    </Descriptions.Item>

                    <Descriptions.Item label={<span><MailOutlined /> Email Επικοινωνίας</span>}>
                        {user.username}@school.gr
                    </Descriptions.Item>

                    <Descriptions.Item label="Κατάσταση">
                        <Tag color="blue">Ενεργός</Tag>
                    </Descriptions.Item>

                    {/* Conditional Item: Εμφανίζεται μόνο αν ο χρήστης έχει αυξημένα δικαιώματα */}
                    {isAdmin && (
                        <Descriptions.Item label="Δικαιώματα">
                            Πλήρη πρόσβαση (Διαγραφή, Προσθήκη, Επεξεργασία)
                        </Descriptions.Item>
                    )}
                </Descriptions>
            </Card>
        </div>
    );
};

export default UserProfile;