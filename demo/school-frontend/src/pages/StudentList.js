import React, { useEffect, useState, useRef } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Space, Card, Tag, Progress, Descriptions, Divider, Row, Col, List, Badge } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PrinterOutlined, EyeOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { CertificateTemplate } from '../components/CertificateTemplate';
import axios from 'axios';

axios.defaults.withCredentials = true;
const { Search } = Input;
const { Option } = Select;

const StudentList = ({ userRole }) => {
    const [students, setStudents] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal για Προσθήκη/Επεξεργασία
    const [isDetailsVisible, setIsDetailsVisible] = useState(false); // Modal για Καρτέλα Μαθητή
    const [editingStudent, setEditingStudent] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentHistory, setStudentHistory] = useState([]);
    const [form] = Form.useForm();
    const printRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: 'Βεβαίωση_Ενημέρωσης',
    });

    const fetchStudents = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/students').then(res => setStudents(res.data)).finally(() => setLoading(false));
    };

    const fetchClassrooms = () => {
        axios.get('http://localhost:8080/api/classrooms').then(res => setClassrooms(res.data));
    };

    useEffect(() => {
        fetchStudents();
        fetchClassrooms();
    }, []);

    const showStudentDetails = async (student) => {
        setSelectedStudent(student);
        try {
            const res = await axios.get(`http://localhost:8080/api/attendance/student/${student.id}`);
            setStudentHistory(res.data.filter(a => !a.present));
            setIsDetailsVisible(true);
        } catch (error) {
            message.error("Σφάλμα κατά τη φόρτωση ιστορικού");
        }
    };

    const saveStudentDetails = async () => {
        try {
            await axios.put(`http://localhost:8080/api/students/${selectedStudent.id}/details`, {
                comments: selectedStudent.comments,
                parentPhone: selectedStudent.parentPhone,
                address: selectedStudent.address
            });
            message.success("Το προφίλ ενημερώθηκε!");
            setIsDetailsVisible(false);
            fetchStudents();
        } catch (error) { message.error("Σφάλμα αποθήκευσης"); }
    };

    const openForm = (student = null) => {
        setEditingStudent(student);
        if (student) {
            form.setFieldsValue({
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
                classroom_id: student.classroom ? student.classroom.id : null
            });
        } else { form.resetFields(); }
        setIsModalOpen(true);
    };

    const handleSave = async (values) => {
        try {
            const payload = {
                firstName: values.firstName, lastName: values.lastName, email: values.email,
                classroom: values.classroom_id ? { id: values.classroom_id } : null
            };
            if (editingStudent) {
                await axios.put(`http://localhost:8080/api/students/${editingStudent.id}`, payload);
            } else {
                await axios.post('http://localhost:8080/api/students', payload);
            }
            setIsModalOpen(false);
            fetchStudents();
        } catch (error) { message.error("Σφάλμα"); }
    };

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
                    {userRole.includes("ADMIN") && (
                        <>
                            <Button icon={<PrinterOutlined />} onClick={async () => { await setSelectedStudent(record); handlePrint(); }}>Βεβαίωση</Button>
                            <Button danger icon={<DeleteOutlined />} onClick={() => {
                                Modal.confirm({
                                    title: 'Διαγραφή;',
                                    onOk: () => axios.delete(`http://localhost:8080/api/students/${record.id}`).then(() => { fetchStudents(); message.success("Διαγράφηκε"); })
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
            <Card title="🏫 Διαχείριση Μαθητολογίου" extra={<Button type="primary" onClick={() => openForm()}>+ Νέα Εγγραφή</Button>}>
                <Search placeholder="Αναζήτηση..." enterButton onSearch={(val) => {
                    const url = val ? `http://localhost:8080/api/students/search?lastName=${val}` : `http://localhost:8080/api/students`;
                    axios.get(url).then(res => setStudents(res.data));
                }} style={{ marginBottom: 20, maxWidth: 400 }} />
                <Table dataSource={students} columns={columns} rowKey="id" loading={loading} />
            </Card>

            {/* Modal Επεξεργασίας */}
            <Modal title={editingStudent ? "📝 Επεξεργασία" : "🆕 Νέα Εγγραφή"} open={isModalOpen} onOk={() => form.submit()} onCancel={() => setIsModalOpen(false)}>
                <Form form={form} layout="vertical" onFinish={handleSave}>
                    <Form.Item name="firstName" label="Όνομα" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="lastName" label="Επίθετο" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="email" label="Email"><Input /></Form.Item>
                    <Form.Item name="classroom_id" label="Τμήμα">
                        <Select placeholder="Επιλέξτε τμήμα">
                            {classrooms.map(c => <Option key={c.id} value={c.id}>{c.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Καρτέλας Μαθητή */}
            <Modal
                title={`Καρτέλα Μαθητή: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
                open={isDetailsVisible}
                onCancel={() => setIsDetailsVisible(false)}
                footer={[
                    <Button key="save" type="primary" onClick={saveStudentDetails}>Αποθήκευση Αλλαγών</Button>
                ]}
                width={700}
            >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ textAlign: 'center', flex: '1' }}>
                        <Progress type="dashboard" percent={Math.min((studentHistory.length / 20) * 100, 100)} format={() => `${studentHistory.length}/20`} status={studentHistory.length >= 20 ? 'exception' : 'normal'} />
                        <p><b>Απουσίες</b></p>
                    </div>
                    <div style={{ flex: '2' }}>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="ΑΜ">{selectedStudent?.id + 1000}</Descriptions.Item>
                            <Descriptions.Item label="Τμήμα">{selectedStudent?.classroom?.name || '-'}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>
                <Divider orientation="left">Στοιχεία & Σημειώσεις</Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <p><b>📞 Τηλέφωνο:</b></p>
                        <Input value={selectedStudent?.parentPhone} onChange={(e) => setSelectedStudent({...selectedStudent, parentPhone: e.target.value})} />
                    </Col>
                    <Col span={12}>
                        <p><b>🏠 Διεύθυνση:</b></p>
                        <Input value={selectedStudent?.address} onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})} />
                    </Col>
                </Row>
                <div style={{ marginTop: 15 }}>
                    <p><b>📝 Σημειώσεις:</b></p>
                    <Input.TextArea rows={3} value={selectedStudent?.comments} onChange={(e) => setSelectedStudent({...selectedStudent, comments: e.target.value})} />
                </div>
                <Divider orientation="left">Ιστορικό Απουσιών</Divider>
                <List size="small" bordered dataSource={studentHistory} renderItem={item => (
                    <List.Item>📅 {new Date(item.date).toLocaleDateString('el-GR')} <Tag color="red" style={{marginLeft: 10}}>Απών</Tag></List.Item>
                )} style={{ maxHeight: 150, overflowY: 'auto' }} />
            </Modal>

            <div style={{ display: 'none' }}>
                <CertificateTemplate ref={printRef} student={selectedStudent} />
            </div>
        </div>
    );
};

export default StudentList;