import React, { useEffect, useState, useCallback } from 'react';
import { Table, Card, Tag, message, Avatar, Select, Button, Modal, Form, Input, Space } from 'antd';
import { UserOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

/**
 * Component: TeacherList
 * Σκοπός: Διαχείριση και προβολή του εκπαιδευτικού προσωπικού του σχολείου.
 * Λειτουργίες:
 * 1. Προβολή λίστας με ειδικότητες και υπεύθυνα τμήματα.
 * 2. Φιλτράρισμα ανά ειδικότητα (π.χ. ΠΕ70, ΠΕ86).
 * 3. Πλήρες CRUD (Προσθήκη, Ενημέρωση, Διαγραφή) με περιορισμούς ρόλων (Admin only).
 */
const TeacherList = ({ userRole }) => {
    // --- States εφαρμογής ---
    const [teachers, setTeachers] = useState([]); // Η πλήρης λίστα από το Backend
    const [filteredTeachers, setFilteredTeachers] = useState([]); // Η λίστα μετά το φιλτράρισμα
    const [classrooms, setClassrooms] = useState([]); // Διαθέσιμα τμήματα για ανάθεση
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // Έλεγχος Modal φόρμας
    const [editingTeacher, setEditingTeacher] = useState(null); // Εκπαιδευτικός προς επεξεργασία
    const [form] = Form.useForm();

    /**
     * fetchTeachers: Ανάκτηση εκπαιδευτικών.
     * Χρήση useCallback για αποφυγή περιττών re-renders στις εξαρτήσεις του useEffect.
     */
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

    // Ανάκτηση τμημάτων για το Select της φόρμας
    const fetchClassrooms = useCallback(() => {
        axios.get('http://localhost:8080/api/classrooms')
            .then(res => setClassrooms(res.data));
    }, []);

    useEffect(() => {
        fetchTeachers();
        fetchClassrooms();
    }, [fetchTeachers, fetchClassrooms]);

    /**
     * openForm: Προετοιμασία της φόρμας.
     * Αν υπάρχει αντικείμενο teacher, η φόρμα γεμίζει (Edit mode), αλλιώς καθαρίζει (Add mode).
     */
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

    /**
     * handleSave: Αποστολή δεδομένων στο Backend.
     * Περιλαμβάνει λογική για POST (νέος) και PUT (ενημέρωση).
     */
    const handleSave = async (values) => {
        try {
            setLoading(true);
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                specialty: values.specialty,
                email: values.email,
                // Σημαντικό: Σύνδεση με το τμήμα μέσω ID αν έχει επιλεγεί
                classroom: values.classroom_id ? { id: values.classroom_id } : null
            };

            if (editingTeacher) {
                await axios.put(`http://localhost:8080/api/teachers/${editingTeacher.id}`, payload);
                message.success("Ενημερώθηκε επιτυχώς!");
            } else {
                await axios.post('http://localhost:8080/api/teachers', payload);
                message.success("Προστέθηκε επιτυχώς!");
            }

            setIsModalOpen(false);
            fetchTeachers(); // Ανανέωση της λίστας
        } catch (error) {
            // Έλεγχος αν το τμήμα είναι ήδη πιασμένο (Business Logic Error από το Backend)
            message.error(error.response?.data?.message || "Αποτυχία αποθήκευσης.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * handleFilterChange: Φιλτράρισμα της λίστας στην πλευρά του Frontend.
     * Επιτρέπει γρήγορη αναζήτηση χωρίς επιπλέον κλήσεις στο API.
     */
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

    // Προσθήκη της συνάρτησης διαγραφής
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
                    fetchTeachers(); // Καλεί τη λήψη των δασκάλων ξανά
                } catch (error) {
                    message.error("Σφάλμα κατά τη διαγραφή");
                }
            }
        });
    };

    /**
     * columns: Ορισμός στηλών πίνακα.
     * Περιλαμβάνει conditional logic για την εμφάνιση των κουμπιών "Ενέργειες" μόνο στους ADMIN.
     */
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
        {
            title: 'Ειδικότητα',
            dataIndex: 'specialty',
            key: 'specialty',
            render: (tag) => <Tag color="blue">{tag}</Tag>
        },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Υπεύθυνος Τμήματος',
            dataIndex: 'classroom',
            key: 'classroom',
            render: (classroom) => classroom ? <Tag color="green">{classroom.name}</Tag> : <Tag>Ειδικότητα</Tag>
        }
    ];

    // Προσθήκη στήλης Ενεργειών μόνο αν ο χρήστης έχει ρόλο ADMIN
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
            extra={userRole?.includes("ADMIN") && (
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
                    Νέος Εκπαιδευτικός
                </Button>
            )}
        >
            {/* UI Φιλτραρίσματος */}
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
                </Select>
            </div>

            <Table
                dataSource={filteredTeachers}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />

            {/* Modal Φόρμας */}
            <Modal
                title={editingTeacher ? "📝 Επεξεργασία Εκπαιδευτικού" : "🆕 Προσθήκη Εκπαιδευτικού"}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => setIsModalOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="firstName" label="Όνομα" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="lastName" label="Επίθετο" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="specialty" label="Ειδικότητα" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}><Input /></Form.Item>
                    <Form.Item name="classroom_id" label="Υπεύθυνος Τμήματος">
                        <Select placeholder="Επιλέξτε τμήμα" allowClear>
                            <Option value={null}>--- Κανένα Τμήμα ---</Option>
                            {classrooms.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default TeacherList;