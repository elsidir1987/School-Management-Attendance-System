import React, { useState } from 'react';
import { DatePicker, Table, Card, Tag, Empty, Button } from 'antd'; // Προσθήκη Button
import { FilePdfOutlined } from '@ant-design/icons'; // Προσθήκη Icon
import axios from 'axios';
import dayjs from 'dayjs';

const AttendanceHistory = ({ classroomId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const onDateChange = (date) => {
        if (!date) return;
        setLoading(true);
        const dateStr = date.format('YYYY-MM-DD');

        axios.get(`http://localhost:8080/api/attendance/history/${classroomId}/${dateStr}`)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const columns = [
        { title: 'Όνομα', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Επώνυμο', dataIndex: 'lastName', key: 'lastName' },
        {
            title: 'Κατάσταση',
            dataIndex: 'present',
            key: 'present',
            render: (present) => present ?
                <Tag color="green">Παρών</Tag> :
                <Tag color="red">Απών</Tag>
        }
    ];

    return (
        <Card title="📜 Ιστορικό Απουσιολογίου">
            {/* Χρησιμοποιούμε flex για να είναι στην ίδια γραμμή το DatePicker και το Button */}
            <div style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    Επιλέξτε Ημερομηνία: <DatePicker onChange={onDateChange} defaultValue={dayjs()} />
                </div>

                <Button
                    type="primary"
                    icon={<FilePdfOutlined />}
                    onClick={() => window.print()}
                    disabled={data.length === 0} // Απενεργοποίηση αν δεν υπάρχουν δεδομένα
                >
                    Εξαγωγή σε PDF / Εκτύπωση
                </Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false} // Συνήθως στα PDF θέλουμε όλη τη λίστα
                locale={{ emptyText: <Empty description="Δεν βρέθηκαν απουσίες για αυτή τη μέρα" /> }}
            />
        </Card>
    );
};

export default AttendanceHistory;