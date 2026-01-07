import React, { useEffect, useState } from 'react';
import { Table, Card, Switch, Button, message, Typography, Badge, Modal, Progress, Divider, List,Input,Descriptions, Row, Col, Tag} from 'antd';
import { CheckOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const MyClassroom = ({ teacherId, classroomId, classroomName }) => {
    // 1. ΟΛΑ τα states πρέπει να είναι ΜΕΣΑ στο Component
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentHistory, setStudentHistory] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!classroomId) return;
            setLoading(true);
            try {
                const resStudents = await axios.get(`http://localhost:8080/api/students/classroom/${classroomId}`);
                const studentsData = resStudents.data;
                setStudents(studentsData);

                const today = new Date().toISOString().split('T')[0];
                const resAttendance = await axios.get(`http://localhost:8080/api/attendance/history/${classroomId}/${today}`);
                const savedAttendance = resAttendance.data;

                const initialAttendance = {};
                studentsData.forEach(s => {
                    const savedRecord = savedAttendance.find(a => a.id === s.id);
                    initialAttendance[s.id] = savedRecord ? savedRecord.present : true;
                });

                setAttendance(initialAttendance);
            } catch (error) {
                console.error("Error fetching data", error);
                message.error("Σφάλμα φόρτωσης δεδομένων");
            }
            setLoading(false);
        };
        fetchData();
    }, [classroomId]);

    // 2. Η συνάρτηση για το Modal ΜΕΣΑ στο Component
    const showStudentDetails = async (student) => {
        setSelectedStudent(student);
        try {
            const res = await axios.get(`http://localhost:8080/api/attendance/student/${student.id}`);
            // Κρατάμε μόνο τις απουσίες (present === false)
            setStudentHistory(res.data.filter(a => !a.present));
            setIsModalVisible(true);
        } catch (error) {
            message.error("Σφάλμα κατά τη φόρτωση ιστορικού μαθητή");
        }
    };

    const saveStudentDetails = async () => {
        try {
            await axios.put(`http://localhost:8080/api/students/${selectedStudent.id}/details`, {
                comments: selectedStudent.comments,
                parentPhone: selectedStudent.parentPhone
            });

            // Ενημέρωση της τοπικής λίστας students για να κρατήσει τα νέα στοιχεία
            setStudents(prev => prev.map(s =>
                s.id === selectedStudent.id ? { ...s, comments: selectedStudent.comments, parentPhone: selectedStudent.parentPhone } : s
            ));

            message.success("Τα στοιχεία του μαθητή ενημερώθηκαν!");
            setIsModalVisible(false);
        } catch (error) {
            message.error("Σφάλμα κατά την αποθήκευση");
        }
    };

    const handleAttendanceChange = async (studentId, isPresent) => {
        if (!isPresent) {
            try {
                const res = await axios.get(`http://localhost:8080/api/attendance/count-absences/${studentId}`);
                const totalPreviousAbsences = res.data;
                if (totalPreviousAbsences >= 20) {
                    message.error(`Προσοχή! Ο μαθητής έχει ήδη ${totalPreviousAbsences} απουσίες!`);
                }
            } catch (error) {
                console.error("Σφάλμα στον έλεγχο απουσιών", error);
            }
        }
        setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
    };

    const submitAttendance = () => {
        const dataToSend = students.map(student => ({
            student: { id: student.id },
            classroom: { id: classroomId },
            present: attendance[student.id]
        }));

        axios.post('http://localhost:8080/api/attendance/save-batch', dataToSend)
            .then(() => message.success("Το απουσιολόγιο αποθηκεύτηκε επιτυχώς!"))
            .catch(() => message.error("Σφάλμα κατά την αποθήκευση."));
    };

    const columns = [
        {
            title: 'Μαθητής',
            key: 'name',
            render: (_, record) => (
                <Button type="link" onClick={() => showStudentDetails(record)}>
                    {`${record.firstName} ${record.lastName}`}
                </Button>
            )
        },
        {
            title: 'Κατάσταση',
            key: 'status',
            render: (_, record) => (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    checked={attendance[record.id]}
                    onChange={(checked) => handleAttendanceChange(record.id, checked)}
                />
            )
        },
        {
            title: 'Επισήμανση',
            render: (_, record) => attendance[record.id] ?
                <Badge status="success" text="Παρόν" /> :
                <Badge status="error" text="Απών" />
        }
    ];

    return (
        <>
            <Card style={{ margin: '20px', borderRadius: '15px', borderTop: '5px solid #1890ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Title level={3}>📖 Απουσιολόγιο: Τμήμα {classroomName}</Title>
                    <Button type="primary" icon={<SaveOutlined />} size="large" onClick={submitAttendance}>
                        Οριστικοποίηση Σήμερα
                    </Button>
                </div>

                <Table
                    dataSource={students}
                    columns={columns}
                    rowKey="id"
                    pagination={false}
                    loading={loading}
                />
            </Card>

            <Modal
                title={`Καρτέλα Μαθητή: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setIsModalVisible(false)}>Κλείσιμο</Button>,
                    <Button key="save" type="primary" onClick={saveStudentDetails}>Αποθήκευση Αλλαγών</Button>
                ]}
                width={700}
            >
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    {/* Αριστερή πλευρά: Στατιστικά Απουσιών */}
                    <div style={{ textAlign: 'center', flex: '1' }}>
                        <Progress
                            type="dashboard"
                            percent={Math.min((studentHistory.length / 20) * 100, 100)}
                            format={() => `${studentHistory.length}/20`}
                            status={studentHistory.length >= 20 ? 'exception' : 'normal'}
                            strokeColor={studentHistory.length >= 15 ? '#faad14' : '#52c41a'}
                        />
                        <p><b>Συνολικές Απουσίες</b></p>
                    </div>

                    {/* Δεξιά πλευρά: Βασικές Πληροφορίες (Read Only) */}
                    <div style={{ flex: '2' }}>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label="Αριθμός Μητρώου (ΑΜ)">{selectedStudent?.id + 1000}</Descriptions.Item>
                            <Descriptions.Item label="Τμήμα">{classroomName}</Descriptions.Item>
                            <Descriptions.Item label="Κατάσταση Φοίτησης">
                                <Badge status="success" text="Ενεργός" />
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                <Divider orientation="left">Στοιχεία Επικοινωνίας & Σημειώσεις</Divider>

                <Row gutter={16}>
                    <Col span={12}>
                        <p><b>📞 Τηλέφωνο Γονέα/Κηδεμόνα:</b></p>
                        <Input
                            value={selectedStudent?.parentPhone}
                            onChange={(e) => setSelectedStudent({...selectedStudent, parentPhone: e.target.value})}
                            placeholder="π.χ. 697XXXXXXX"
                        />
                    </Col>
                    <Col span={12}>
                        <p><b>🏠 Διεύθυνση Κατοικίας:</b></p>
                        <Input
                            value={selectedStudent?.address}
                            onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})}
                            placeholder="Οδός, Αριθμός, Πόλη"
                        />
                    </Col>
                </Row>

                <div style={{ marginTop: '15px' }}>
                    <p><b>📝 Παιδαγωγικές Σημειώσεις:</b></p>
                    <Input.TextArea
                        rows={3}
                        value={selectedStudent?.comments}
                        onChange={(e) => setSelectedStudent({...selectedStudent, comments: e.target.value})}
                        placeholder="Προσθέστε παρατηρήσεις για την πρόοδο ή τη συμπεριφορά..."
                    />
                </div>

                <Divider orientation="left">Πρόσφατες Απουσίες (Ιστορικό)</Divider>
                <List
                    size="small"
                    bordered
                    dataSource={studentHistory}
                    renderItem={item => (
                        <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>📅 {new Date(item.date).toLocaleDateString('el-GR')}</span>
                            <Tag color="red">Απών</Tag>
                        </List.Item>
                    )}
                    locale={{ emptyText: "Δεν έχουν καταγραφεί απουσίες." }}
                    style={{ maxHeight: 150, overflowY: 'auto', background: '#fafafa' }}
                />
            </Modal>
        </>
    );
};

export default MyClassroom;