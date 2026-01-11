import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Card, Tag, Progress, Descriptions, Divider, Row, Col, List, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { CertificateTemplate } from '../components/CertificateTemplate';
import axios from 'axios';

// Ρύθμιση για την αποστολή των cookies/session στο Backend
axios.defaults.withCredentials = true;
const { Search } = Input;
const { Option } = Select;

/**
 * Component: StudentList
 * Σκοπός: Η κεντρική διαχείριση όλων των μαθητών του σχολείου.
 * Λειτουργίες: Προβολή λίστας, Αναζήτηση, Προσθήκη/Επεξεργασία, Διαγραφή,
 * Προβολή Προφίλ και Εκτύπωση Βεβαιώσεων Φοίτησης.
 */
const StudentList = ({ userRole }) => {
    // --- States εφαρμογής ---
    const [students, setStudents] = useState([]); // Η λίστα των μαθητών
    const [classrooms, setClassrooms] = useState([]); // Τα διαθέσιμα τμήματα για ανάθεση
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal Φόρμας
    const [isDetailsVisible, setIsDetailsVisible] = useState(false); // Modal Προφίλ
    const [editingStudent, setEditingStudent] = useState(null); // Μαθητής προς επεξεργασία
    const [selectedStudent, setSelectedStudent] = useState(null); // Μαθητής για προβολή/εκτύπωση
    const [studentHistory, setStudentHistory] = useState([]); // Ιστορικό απουσιών

    const [form] = Form.useForm(); // Hook για τον έλεγχο της φόρμας της Ant Design
    const printRef = useRef(); // Reference για το τμήμα που θα εκτυπωθεί
    const [studentGrades, setStudentGrades] = useState([]);

    /**
     * Λειτουργία Εκτύπωσης:
     * Χρησιμοποιεί το react-to-print για να στείλει το CertificateTemplate στον εκτυπωτή.
     */
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Βεβαίωση_Ενημέρωσης',
    });

    // Ανάκτηση όλων των μαθητών από το API
    const fetchStudents = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/students')
            .then(res => setStudents(res.data))
            .finally(() => setLoading(false));
    };

    // Ανάκτηση τμημάτων για τη σύνδεση μαθητή-τάξης
    const fetchClassrooms = () => {
        axios.get('http://localhost:8080/api/classrooms').then(res => setClassrooms(res.data));
    };

    useEffect(() => {
        fetchStudents();
        fetchClassrooms();
    }, []);

    /**
     * showStudentDetails: Φέρνει τις απουσίες του μαθητή και ανοίγει την καρτέλα του.
     */
    const showStudentDetails = async (student) => {
        setSelectedStudent(student);
        try {
            // Φέρνουμε απουσίες
            const resAttendance = await axios.get(`http://localhost:8080/api/attendance/student/${student.id}`);
            setStudentHistory(resAttendance.data.filter(a => !a.present));

            // Φέρνουμε βαθμούς (ΝΕΟ)
            const resGrades = await axios.get(`http://localhost:8080/api/grades/student/${student.id}`);
            setStudentGrades(resGrades.data);

            setIsDetailsVisible(true);
        } catch (error) {
            message.error("Σφάλμα κατά τη φόρτωση δεδομένων μαθητή");
        }
    };

    /**
     * handleSave: Διπλή λειτουργία (Create ή Update) ανάλογα αν υπάρχει editingStudent.
     */
    const handleSave = async (values) => {
        try {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                classroom: values.classroom_id ? { id: values.classroom_id } : null
            };

            if (editingStudent) {
                // Ενημέρωση υπάρχοντος μαθητή
                await axios.put(`http://localhost:8080/api/students/${editingStudent.id}`, payload);
                message.success("Η ενημέρωση ολοκληρώθηκε");
            } else {
                // Δημιουργία νέου μαθητή
                await axios.post('http://localhost:8080/api/students', payload);
                message.success("Η εγγραφή πραγματοποιήθηκε");
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error) { message.error("Σφάλμα κατά την αποθήκευση"); }
    };
    // Προσθήκη αυτής της συνάρτησης για το άνοιγμα της φόρμας
    const openForm = (student = null) => {
        setEditingStudent(student);
        if (student) {
            form.setFieldsValue({
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                classroom_id: student.classroom ? student.classroom.id : null
            });
        } else {
            form.resetFields();
        }
        setIsModalOpen(true);
    };

    // Προσθήκη αυτής της συνάρτησης για την αποθήκευση λεπτομερειών (Σημειώσεις κλπ)
    const saveStudentDetails = async () => {
        try {
            await axios.put(`http://localhost:8080/api/students/${selectedStudent.id}/details`, {
                comments: selectedStudent.comments,
                parentPhone: selectedStudent.parentPhone,
                address: selectedStudent.address
            });
            message.success("Το προφίλ ενημερώθηκε!");
            setIsDetailsVisible(false);
            fetchStudents(); // Ανανέωση της λίστας
        } catch (error) {
            message.error("Σφάλμα κατά την αποθήκευση");
        }
    };

    /**
     * Ορισμός Στηλών Πίνακα
     * Περιλαμβάνει δυναμικά κουμπιά ενεργειών βάσει του ρόλου του χρήστη (userRole).
     */
    const columns = [
        { title: 'Όνομα', dataIndex: 'firstName', key: 'firstName' },
        { title: 'Επίθετο', dataIndex: 'lastName', key: 'lastName' },
        {
            title: 'Τμήμα',
            dataIndex: 'classroom',
            render: (classroom) => classroom ? <Tag color="blue">{classroom.name}</Tag> : '-'
        },
        {
            title: 'Ενέργειες',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => showStudentDetails(record)}>Προφίλ</Button>
                    <Button icon={<EditOutlined />} onClick={() => openForm(record)}>Επεξεργασία</Button>

                    {/* Λειτουργίες διαθέσιμες μόνο στον ADMIN */}
                    {userRole.includes("ADMIN") && (
                        <>
                            <Button icon={<PrinterOutlined />} onClick={async () => {
                                await setSelectedStudent(record);
                                handlePrint();
                            }}>Βεβαίωση</Button>

                            <Button danger icon={<DeleteOutlined />} onClick={() => {
                                Modal.confirm({
                                    title: 'Επιβεβαίωση Διαγραφής',
                                    content: 'Είστε σίγουροι ότι θέλετε να διαγράψετε τον μαθητή;',
                                    okText: 'Διαγραφή',
                                    okType: 'danger',
                                    onOk: () => axios.delete(`http://localhost:8080/api/students/${record.id}`)
                                        .then(() => { fetchStudents(); message.success("Ο μαθητής διαγράφηκε"); })
                                });
                            }}>Διαγραφή</Button>
                        </>
                    )}
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            {/* Κύριος Πίνακας με Search Bar */}
            <Card title="🏫 Διαχείριση Μαθητολογίου" extra={<Button type="primary" onClick={() => openForm()}>+ Νέα Εγγραφή</Button>}>
                <Search
                    placeholder="Αναζήτηση με επίθετο..."
                    enterButton
                    onSearch={(val) => {
                        const url = val ? `http://localhost:8080/api/students/search?lastName=${val}` : `http://localhost:8080/api/students`;
                        axios.get(url).then(res => setStudents(res.data));
                    }}
                    style={{ marginBottom: 20, maxWidth: 400 }}
                />
                <Table dataSource={students} columns={columns} rowKey="id" loading={loading} />
            </Card>

            {/* Modal Φόρμας (Προσθήκη/Επεξεργασία) */}
            <Modal
                title={`Καρτέλα Μαθητή: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
                open={isDetailsVisible}
                onCancel={() => setIsDetailsVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setIsDetailsVisible(false)}>Κλείσιμο</Button>,
                    <Button key="save" type="primary" onClick={saveStudentDetails}>Αποθήκευση Αλλαγών</Button>
                ]}
                width={700}
            >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center', flex: '1' }}>
                        <Progress
                            type="dashboard"
                            percent={Math.min((studentHistory.length / 20) * 100, 100)}
                            format={() => `${studentHistory.length}/20`}
                            status={studentHistory.length >= 20 ? 'exception' : 'normal'}
                        />
                        <p><b>Απουσίες</b></p>
                    </div>
                    <div style={{ flex: '2' }}>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="ΑΜ">{selectedStudent?.id + 1000}</Descriptions.Item>
                            <Descriptions.Item label="Τμήμα">{selectedStudent?.classroom?.name || '-'}</Descriptions.Item>
                            <Descriptions.Item label="Κατάσταση"><Badge status="success" text="Ενεργός" /></Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                <Divider orientation="left">Στοιχεία Επικοινωνίας & Σημειώσεις</Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <p><b>📞 Τηλέφωνο Γονέα:</b></p>
                        <Input
                            value={selectedStudent?.parentPhone}
                            onChange={(e) => setSelectedStudent({...selectedStudent, parentPhone: e.target.value})}
                        />
                    </Col>
                    <Col span={12}>
                        <p><b>🏠 Διεύθυνση:</b></p>
                        <Input
                            value={selectedStudent?.address}
                            onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})}
                        />
                    </Col>
                </Row>

                <div style={{ marginTop: '15px' }}>
                    <p><b>📝 Παιδαγωγικές Σημειώσεις:</b></p>
                    <Input.TextArea
                        rows={4}
                        value={selectedStudent?.comments}
                        onChange={(e) => setSelectedStudent({...selectedStudent, comments: e.target.value})}
                        placeholder="Προσθέστε παρατηρήσεις για την πρόοδο του μαθητή..."
                    />
                </div>

                <Divider orientation="left">📊 Επίδοση & Βαθμολογία</Divider>
                <List
                    size="small"
                    bordered
                    dataSource={studentGrades}
                    renderItem={item => (
                        <List.Item>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span><b>{item.subject}</b> ({item.term})</span>
                                <Tag color={item.value >= 10 ? "blue" : "volcano"}>
                                    {item.value} / 20
                                </Tag>
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: "Δεν έχουν καταχωρηθεί βαθμοί για αυτόν τον μαθητή." }}
                    style={{ marginBottom: '20px', backgroundColor: '#fafafa' }}
                />
                <Divider orientation="left">Ιστορικό Απουσιών (Πρόσφατες)</Divider>
                <List
                    size="small"
                    bordered
                    dataSource={studentHistory}
                    renderItem={item => (
                        <List.Item>
                            <span>📅 {new Date(item.date).toLocaleDateString('el-GR')}</span>
                            <Tag color="red">Απών</Tag>
                        </List.Item>
                    )}
                    locale={{ emptyText: 'Δεν υπάρχουν καταγεγραμμένες απουσίες.' }}
                    style={{ maxHeight: 150, overflowY: 'auto' }}
                />
            </Modal>

            {/* Κρυφό τμήμα για την εκτύπωση */}
            <div style={{ display: 'none' }}>
                <CertificateTemplate ref={printRef} student={selectedStudent} />
            </div>
            {/* Modal Φόρμας (Προσθήκη/Επεξεργασία) */}
            <Modal
                title={editingStudent ? "Επεξεργασία Μαθητή" : "Προσθήκη Νέου Μαθητή"}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={() => form.submit()} // Υποβάλλει τη φόρμα όταν πατάς OK
                okText="Αποθήκευση"
                cancelText="Ακύρωση"
            >
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item
                        name="firstName"
                        label="Όνομα"
                        rules={[{ required: true, message: 'Παρακαλώ εισάγετε όνομα' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Επίθετο"
                        rules={[{ required: true, message: 'Παρακαλώ εισάγετε επίθετο' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ type: 'email', message: 'Εισάγετε έγκυρο email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="classroom_id" label="Τμήμα">
                        <Select placeholder="Επιλέξτε τμήμα" allowClear>
                            {classrooms.map(c => (
                                <Option key={c.id} value={c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default StudentList;