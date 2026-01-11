import React, { useEffect, useState } from 'react';
import { Table, Card, message, Badge, Button, Modal, List, Avatar } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

/**
 * Component: ClassroomList
 * Σκοπός: Προβολή όλων των τμημάτων του σχολείου, των υπεύθυνων εκπαιδευτικών
 * και δυνατότητα προβολής της λίστας μαθητών ανά τμήμα μέσω Modal.
 */
const ClassroomList = () => {
    // Κατάσταση για τη λίστα των τμημάτων από το Backend
    const [classrooms, setClassrooms] = useState([]);
    // Κατάσταση για το εφέ φόρτωσης (loading state)
    const [loading, setLoading] = useState(true);

    // Κατάσταση για τον έλεγχο ορατότητας του Modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    // Αποθήκευση του τμήματος που επέλεξε ο χρήστης για προβολή μαθητών
    const [selectedClassroom, setSelectedClassroom] = useState(null);

    /**
     * Hook useEffect: Εκτελείται κατά την αρχικοποίηση του component.
     * Πραγματοποιεί κλήση στο API για τη λήψη των τμημάτων.
     */
    useEffect(() => {
        axios.get('http://localhost:8080/api/classrooms')
            .then(res => {
                setClassrooms(res.data); // Τα δεδομένα περιλαμβάνουν και τα nested αντικείμενα (teacher, students)
                setLoading(false);
            })
            .catch(() => {
                message.error("Σφάλμα στη φόρτωση τμημάτων");
                setLoading(false);
            });
    }, []);

    /**
     * Συνάρτηση showStudents:
     * Προετοιμάζει τα δεδομένα του επιλεγμένου τμήματος και ανοίγει το Modal.
     * @param {object} classroom - Το αντικείμενο του τμήματος από τη γραμμή του πίνακα.
     */
    const showStudents = (classroom) => {
        setSelectedClassroom(classroom);
        setIsModalVisible(true);
    };

    /**
     * Ορισμός στηλών του πίνακα (Ant Design Table Columns).
     */
    const columns = [
        {
            title: 'Τμήμα',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b> // Έντονη γραφή για το όνομα του τμήματος
        },
        {
            title: 'Τάξη',
            dataIndex: 'grade',
            key: 'grade',
            // Μετατροπή του αριθμού τάξης (1-6) σε λεκτική περιγραφή (Α' - ΣΤ')
            render: (grade) => {
                const classes = ["", "Α'", "Β'", "Γ'", "Δ'", "Ε'", "ΣΤ'"];
                return `${classes[grade]} Δημοτικού`;
            }
        },
        {
            title: 'Υπεύθυνος Εκπαιδευτικός',
            dataIndex: 'teacher',
            key: 'teacher',
            // Έλεγχος αν υπάρχει εκπαιδευτικός στο τμήμα (null check)
            render: (teacher) => teacher ? (
                <span><UserOutlined /> {teacher.firstName} {teacher.lastName}</span>
            ) : <i style={{color: '#ccc'}}>Δεν έχει οριστεί</i>
        },
        {
            title: 'Πλήθος Μαθητών',
            key: 'studentCount',
            // Χρήση Badge για την εμφάνιση του αριθμού μαθητών (Nested array length)
            render: (_, record) => (
                <Badge count={record.students ? record.students.length : 0} showZero color="#108ee9" />
            )
        },
        {
            title: 'Ενέργειες',
            key: 'actions',
            render: (_, record) => (
                <Button icon={<EyeOutlined />} onClick={() => showStudents(record)}>
                    Λίστα Τάξης
                </Button>
            )
        }
    ];

    return (
        <Card title="🏫 Στατιστικά & Μαθητές ανά Τμήμα" style={{ margin: '20px', borderRadius: '8px' }}>
            {/* Κύριος Πίνακας Τμημάτων */}
            <Table
                dataSource={classrooms}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            {/* Modal: Εμφανίζεται μόνο όταν ο χρήστης πατήσει "Λίστα Τάξης" */}
            <Modal
                title={selectedClassroom ? `Μαθητές Τμήματος ${selectedClassroom.name}` : "Μαθητές"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>Κλείσιμο</Button>
                ]}
            >
                {/* Λίστα Μαθητών: Εμφανίζει τα στοιχεία των μαθητών του επιλεγμένου τμήματος */}
                <List
                    itemLayout="horizontal"
                    dataSource={selectedClassroom ? selectedClassroom.students : []}
                    renderItem={(student) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar icon={<UserOutlined />} style={{ backgroundColor: '#87d068' }} />}
                                title={`${student.firstName} ${student.lastName}`}
                                description={student.email}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </Card>
    );
};

export default ClassroomList;