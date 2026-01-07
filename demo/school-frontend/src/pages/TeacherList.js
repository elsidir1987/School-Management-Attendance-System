import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Tag, message, Avatar, Select, Button, Modal, Form, Input, Space } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const TeacherList = ({ userRole }) => {
    const [teachers, setTeachers] = useState([]);
    const [filteredTeachers, setFilteredTeachers] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [form] = Form.useForm();

    const fetchTeachers = useCallback(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/teachers')
            .then(res => {
                setTeachers(res.data);
                setFilteredTeachers(res.data);
                setLoading(false);
            })
            .catch(() => {
                message.error("Σφάλμα στη φόρτωση εκπαιδευτικών");
                setLoading(false);
            });
    }, []);

    const fetchClassrooms = useCallback(() => {
        axios.get('http://localhost:8080/api/classrooms')
            .then(res => setClassrooms(res.data));
    }, []);

    useEffect(() => {
        fetchTeachers();
        fetchClassrooms();
    }, [fetchTeachers, fetchClassrooms]);

    // Άνοιγμα φόρμας για Προσθήκη ή Επεξεργασία
    const openForm = (teacher = null) => {
        setEditingTeacher(teacher);
        if (teacher) {
            form.setFieldsValue({
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                specialty: teacher.specialty,
                email: teacher.email,
                classroom_id: teacher.classroom ? teacher.classroom.id : null
            });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    const handleSave = async (values) => {
        try {
            setLoading(true);
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                specialty: values.specialty,
                email: values.email,
                // Αν η τιμή είναι null ή undefined, στέλνουμε null
                classroom: values.classroom_id ? { id: values.classroom_id } : null
            };

            console.log("Sending payload:", payload); // Δες τι στέλνεις

            if (editingTeacher) {
                await axios.put(`http://localhost:8080/api/teachers/${editingTeacher.id}`, payload);
                message.success("Ενημερώθηκε επιτυχώς!");
            } else {
                await axios.post('http://localhost:8080/api/teachers', payload);
                message.success("Προστέθηκε επιτυχώς!");
            }

            setIsModalOpen(false);
            fetchTeachers();
        } catch (error) {
            console.error("Full error object:", error); // Δες το σφάλμα στην κονσόλα (F12)
            message.error(error.response?.data?.message || "Αποτυχία αποθήκευσης. Ελέγξτε αν το τμήμα έχει ήδη δάσκαλο.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Διαγραφή Εκπαιδευτικού',
            content: 'Είστε σίγουροι; Η ενέργεια αυτή δεν αναιρείται.',
            okText: 'Διαγραφή',
            okType: 'danger',
            cancelText: 'Άκυρο',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:8080/api/teachers/${id}`);
                    message.success("Ο εκπαιδευτικός διαγράφηκε");
                    fetchTeachers();
                } catch (error) {
                    message.error("Σφάλμα κατά τη διαγραφή");
                }
            }
        });
    };

    const handleFilterChange = (value) => {
        if (!value) {
            setFilteredTeachers(teachers);
        } else {
            const filtered = teachers.filter(t =>
                t.specialty && t.specialty.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTeachers(filtered);
        }
    };

    const columns = [
        {
            title: 'Εκπαιδευτικός',
            key: 'name',
            render: (_, record) => (
                <span>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8, backgroundColor: '#87d068' }} />
                    {record.firstName} {record.lastName}
                </span>
            )
        },
        { title: 'Ειδικότητα', dataIndex: 'specialty', key: 'specialty', render: (tag) => <Tag color="blue">{tag}</Tag> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Υπεύθυνος Τμήματος',
            dataIndex: 'classroom',
            key: 'classroom',
            render: (classroom) => classroom ? <Tag color="green">{classroom.name}</Tag> : <Tag>Ειδικότητα</Tag>
        }
    ];

    // Προσθήκη στήλης ενεργειών ΜΟΝΟ αν ο χρήστης είναι ADMIN
    if (userRole && userRole.includes("ADMIN")) {
        columns.push({
            title: 'Ενέργειες',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openForm(record)}>Επεξεργασία</Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Διαγραφή</Button>
                </Space>
            )
        });
    }

    return (
        <Card
            title="👨‍🏫 Προσωπικό Σχολείου"
            style={{ margin: '20px', borderRadius: '8px' }}
            // Το κουμπί προσθήκης εμφανίζεται ΜΟΝΟ στον ADMIN
            extra={userRole && userRole.includes("ADMIN") && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
                    Νέος Εκπαιδευτικός
                </Button>
            )}
        >
            <div style={{ marginBottom: 20 }}>
                <Select
                    placeholder="🔍 Φιλτράρισμα ανά ειδικότητα"
                    style={{ width: 300 }}
                    allowClear
                    onChange={handleFilterChange}
                >
                    <Option value="ΠΕ70">Δάσκαλοι Τάξης (ΠΕ70)</Option>
                    <Option value="ΠΕ06">Αγγλικών (ΠΕ06)</Option>
                    <Option value="ΠΕ11">Φυσική Αγωγή (ΠΕ11)</Option>
                    <Option value="ΠΕ86">Πληροφορική (ΠΕ86)</Option>
                    <Option value="ΠΕ79">Μουσική (ΠΕ79)</Option>
                </Select>
            </div>

            <Table
                dataSource={filteredTeachers}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title={editingTeacher ? "📝 Επεξεργασία Εκπαιδευτικού" : "🆕 Προσθήκη Εκπαιδευτικού"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                okText="Αποθήκευση"
                cancelText="Άκυρο"
                destroyOnClose // Καθαρίζει τη φόρμα όταν κλείνει
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="firstName" label="Όνομα" rules={[{ required: true, message: 'Εισάγετε όνομα' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Επίθετο" rules={[{ required: true, message: 'Εισάγετε επίθετο' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="specialty" label="Ειδικότητα" rules={[{ required: true, message: 'Εισάγετε ειδικότητα' }]}>
                        <Input placeholder="π.χ. ΠΕ70 - Δάσκαλος" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email', message: 'Λάθος μορφή email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="classroom_id" label="Υπεύθυνος Τμήματος">
                        <Select
                            placeholder="Επιλέξτε τμήμα ή αφήστε κενό για ειδικότητες"
                            allowClear
                        >
                            {/* Προσθήκη επιλογής για "Κανένα" */}
                            <Option value={null}>--- Κανένα Τμήμα / Ειδικότητα ---</Option>

                            {classrooms.map(c => (
                                <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default TeacherList;