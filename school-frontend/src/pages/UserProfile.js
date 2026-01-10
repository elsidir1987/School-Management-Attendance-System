import React from 'react';
import { Card, Descriptions, Avatar, Tag, Divider } from 'antd';
import { UserOutlined, SafetyCertificateOutlined, MailOutlined } from '@ant-design/icons';

const UserProfile = ({ user }) => {
    // Διαχωρισμός ρόλου για πιο όμορφη εμφάνιση
    const isAdmin = user.role.includes("ADMIN");

    return (
        <div style={{ padding: '30px', display: 'flex', justifyContent: 'center' }}>
            <Card
                style={{ width: 600, borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cover={
                    <div style={{
                        height: '120px',
                        background: isAdmin ? 'linear-gradient(90deg, #1890ff, #001529)' : 'linear-gradient(90deg, #52c41a, #237804)',
                        borderRadius: '15px 15px 0 0'
                    }} />
                }
            >
                <div style={{ textAlign: 'center', marginTop: '-60px' }}>
                    <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: '#fff', color: isAdmin ? '#1890ff' : '#52c41a', border: '4px solid #fff' }}
                    />
                    <h2 style={{ marginTop: '10px' }}>{user.username}</h2>
                    <Tag color={isAdmin ? 'gold' : 'green'} icon={<SafetyCertificateOutlined />}>
                        {isAdmin ? "ΔΙΕΥΘΥΝΤΗΣ" : "ΕΚΠΑΙΔΕΥΤΙΚΟΣ"}
                    </Tag>
                </div>

                <Divider />

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