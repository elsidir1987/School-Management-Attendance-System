import React, { useEffect, useState } from 'react';
import { Table, Card, message, Badge, Button, Modal, List, Avatar } from 'antd';
import { EyeOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

const ClassroomList = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);

    // State για το Modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/classrooms')
            .then(res => {
                setClassrooms(res.data);
                setLoading(false);
            })
            .catch(() => {
                message.error("Σφάλμα στη φόρτωση τμημάτων");
                setLoading(false);
            });
    }, []);

    const showStudents = (classroom) => {
        setSelectedClassroom(classroom);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: 'Τμήμα',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Τάξη',
            dataIndex: 'grade',
            key: 'grade',
            render: (grade) => {
                const classes = ["", "Α'", "Β'", "Γ'", "Δ'", "Ε'", "ΣΤ'"];
                return `${classes[grade]} Δημοτικού`;
            }
        },
        {
            title: 'Υπεύθυνος Εκπαιδευτικός',
            dataIndex: 'teacher', // Η Java στέλνει το αντικείμενο teacher μέσα στο classroom
            key: 'teacher',
            render: (teacher) => teacher ? (
                <span><UserOutlined /> {teacher.firstName} {teacher.lastName}</span>
            ) : <i style={{color: '#ccc'}}>Δεν έχει οριστεί</i>
        },
        {
            title: 'Πλήθος Μαθητών',
            key: 'studentCount',
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
            <Table
                dataSource={classrooms}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={false}
            />

            {/* Παράθυρο (Modal) που δείχνει τους μαθητές του επιλεγμένου τμήματος */}
            <Modal
                title={selectedClassroom ? `Μαθητές Τμήματος ${selectedClassroom.name}` : "Μαθητές"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsModalVisible(false)}>Κλείσιμο</Button>
                ]}
            >
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