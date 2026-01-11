import React, { useState } from 'react';
import { DatePicker, Table, Card, Tag, Empty, Button } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

/**
 * Component: AttendanceHistory
 * Σκοπός: Εμφανίζει το ιστορικό παρουσιών/απουσιών για μια συγκεκριμένη τάξη και ημερομηνία.
 * @param {string} classroomId - Το ID της τάξης για την οποία αναζητούμε το ιστορικό.
 */
const AttendanceHistory = ({ classroomId }) => {
    // Κατάσταση για την αποθήκευση των δεδομένων απουσιολογίου
    const [data, setData] = useState([]);
    // Κατάσταση για το εφέ φόρτωσης (loading spinner) κατά το API call
    const [loading, setLoading] = useState(false);

    /**
     * Διαχειριστής αλλαγής ημερομηνίας.
     * Καλείται κάθε φορά που ο χρήστης επιλέγει μια νέα ημερομηνία από το DatePicker.
     * @param {object} date - Το αντικείμενο ημερομηνίας από τη βιβλιοθήκη dayjs.
     */
    const onDateChange = (date) => {
        if (!date) return; // Αν καθαριστεί η ημερομηνία, σταμάτα τη διαδικασία

        setLoading(true);
        // Μετατροπή της ημερομηνίας σε format YYYY-MM-DD για το Backend
        const dateStr = date.format('YYYY-MM-DD');

        // Κλήση API για την ανάκτηση του ιστορικού από τη βάση δεδομένων
        axios.get(`http://localhost:8080/api/attendance/history/${classroomId}/${dateStr}`)
            .then(res => {
                setData(res.data); // Αποθήκευση των αποτελεσμάτων στο state
                setLoading(false);
            })
            .catch((err) => {
                console.error("Σφάλμα κατά την ανάκτηση ιστορικού:", err);
                setLoading(false);
            });
    };

    /**
     * Ορισμός στηλών του πίνακα (Ant Design Table).
     * Περιλαμβάνει Όνομα, Επώνυμο και την οπτική ένδειξη (Tag) της κατάστασης.
     */
    const columns = [
        {
            title: 'Όνομα',
            dataIndex: 'firstName',
            key: 'firstName'
        },
        {
            title: 'Επώνυμο',
            dataIndex: 'lastName',
            key: 'lastName'
        },
        {
            title: 'Κατάσταση',
            dataIndex: 'present',
            key: 'present',
            // Render function για τη δημιουργία χρωματιστών ετικετών (Tags)
            render: (present) => present ?
                <Tag color="green">Παρών</Tag> : // Πράσινο Tag για τους παρόντες
                <Tag color="red">Απών</Tag>      // Κόκκινο Tag για τους απόντες
        }
    ];

    return (
        <Card title="📜 Ιστορικό Απουσιολογίου" style={{ borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>

            {/* Header Εργαλείων: Περιλαμβάνει την επιλογή ημερομηνίας και την εκτύπωση */}
            <div style={{
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <strong>Επιλέξτε Ημερομηνία:</strong>
                    <DatePicker
                        onChange={onDateChange}
                        defaultValue={dayjs()}
                        style={{ marginLeft: 10 }}
                    />
                </div>

                {/* Κουμπί Εκτύπωσης: Χρησιμοποιεί τη λειτουργία του browser για γρήγορη εξαγωγή σε PDF */}
                <Button
                    type="primary"
                    icon={<FilePdfOutlined />}
                    onClick={() => window.print()}
                    disabled={data.length === 0} // Το κουμπί ενεργοποιείται μόνο αν υπάρχουν δεδομένα στον πίνακα
                >
                    Εξαγωγή σε PDF / Εκτύπωση
                </Button>
            </div>

            {/* Πίνακας Δεδομένων */}
            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false} // Εμφάνιση όλων των μαθητών σε μία σελίδα για ευκολότερη εκτύπωση
                locale={{
                    emptyText: <Empty description="Δεν βρέθηκαν απουσίες για αυτή τη μέρα" />
                }}
            />
        </Card>
    );
};

export default AttendanceHistory;