import React, { useEffect, useState,useCallback } from 'react';
import { Table, Card, Switch, Button, message, Typography, Badge, Modal, Progress, Divider, List, Input, Descriptions, Row, Col, Tag, Select, InputNumber,Space } from 'antd';
import { CheckOutlined, CloseOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const { Title } = Typography;

/**
 * Component: MyClassroom
 * Σκοπός: Η κύρια οθόνη του δασκάλου για τη διαχείριση της τάξης του.
 * Περιλαμβάνει: Λήψη παρουσιών, καταχώρηση βαθμολογίας, έκδοση PDF και ενημέρωση γονέων.
 */
const MyClassroom = ({ user,teacherId, classroomId, classroomName, onSaveGrade }) => {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [studentHistory, setStudentHistory] = useState([]);
    const [gradeValue, setGradeValue] = useState(0);
    const [selectedSubject, setSelectedSubject] = useState('Μαθηματικά');
    const [studentGrades, setStudentGrades] = useState([]);
    const [selectedTerm, setSelectedTerm] = useState("Α' Τετράμηνο");
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [allClassrooms, setAllClassrooms] = useState([]);
    const font = "AAEAAAARAQAABAAQR0RFRv7mD6YAAAGcAAAAQkdQT1N6UUpUAAADmAAAASZHU0VGU0Z6fQAAAxQAAABiT1MvMnYlbp8AAAFcAAAAYGNtYXABDZALAAAB7AAAAGxjdnQgAC0EfgAAAlQAAAAoZnBnbV9S33MAAANoAAABY2dhc3AACAATAAABlAAAAAxnbHlmS6mHeQAAArQAAAEkaGVhZNoS834AAAEsAAAANmhoZWEH8QPaAAABRAAAACRobXR4C0AAAAAAAYwAAAAUbG9jYQA0AFoAAACoAAAADG1heHAALwA5AAABWAAAACBuYW1lS7mOFAAAAnQAAAIZcG9zdP9tADQAAAMMAAAAIHByZXB396Y6AAAC0AAAAAsAAQAAAAoAHgAsAAFERkxUAAgABAAAAAD//wAAAAAAAAABAAAACgAeACwAAURGTFQACAAEAAAAAP//AAAAAAAAAAEAAAAMAAAADAABAAAABAACAAQABAAEAAEAAQAAAAEAAAAKAB4ALAAFERkxUAAgABAAAAAD//wAAAAAAAAABAAAACgAeACwAAURGTFQACAAEAAAAAP//AAAAAAAAAAEAAAAOAAAADgABAAAABgAIAAgACAAIAAgABAAEAAEAAQAAAAEAAAAKAB4ALAAFERkxUAAgABAAAAAD//wAAAAAAAAABAAAACgAeACwAAURGTFQACAAEAAAAAP//AAAAAAAA";

    /**
     * useEffect: Αρχική φόρτωση μαθητών και κατάστασης παρουσιολογίου για τη σημερινή ημέρα.
     */
    useEffect(() => {
        if (!user.classroom) {
            axios.get('http://localhost:8080/api/classrooms')
                .then(res => setAllClassrooms(res.data))
                .catch(() => message.error("Αποτυχία φόρτωσης λίστας τμημάτων"));
        } else {
            setSelectedClassroom(user.classroom.id);
        }
    }, [user]);

    // 2. Συνάρτηση φόρτωσης δεδομένων (Μαθητές & Σημερινό Απουσιολόγιο)
    const fetchData = useCallback(async (targetId) => {
        if (!targetId) return;
        setLoading(true);
        try {
            const resStudents = await axios.get(`http://localhost:8080/api/students/classroom/${targetId}`);
            setStudents(resStudents.data);

            const today = new Date().toISOString().split('T')[0];
            const resAtt = await axios.get(`http://localhost:8080/api/attendance/history/${targetId}/${today}`);

            const initialAttendance = {};
            resStudents.data.forEach(s => {
                const saved = resAtt.data.find(a => a.student && a.student.id === s.id);
                initialAttendance[s.id] = saved ? saved.present : true;
            });
            setAttendance(initialAttendance);
        } catch (error) {
            message.error("Σφάλμα κατά την ανάκτηση δεδομένων τμήματος");
        } finally {
            setLoading(false);
        }
        }, []);


    const fetchStudentsByClassroom = (classId) => {
        setLoading(true);
        axios.get(`http://localhost:8080/api/students/classroom/${classId}`)
            .then(res => setStudents(res.data))
            .catch(err => message.error("Σφάλμα φόρτωσης μαθητών"))
            .finally(() => setLoading(false));
    };
    /**
     * showStudentDetails: Φόρτωση πλήρους ιστορικού (απουσίες & βαθμοί) για έναν μαθητή.
     */
    const showStudentDetails = async (student) => {
        setSelectedStudent(student);
        try {
            const [resAtt, resGrades] = await Promise.all([
                axios.get(`http://localhost:8080/api/attendance/student/${student.id}`),
                axios.get(`http://localhost:8080/api/grades/student/${student.id}`)
            ]);
            setStudentHistory(resAtt.data.filter(a => !a.present));
            setStudentGrades(resGrades.data);
            setIsModalVisible(true);
        } catch (error) {
            message.error("Σφάλμα φόρτωσης προφίλ");
        }
    };
    /**
     * sendMessageToParent: Διαμεσολάβηση για ενημέρωση γονέα μέσω WhatsApp/Viber.
     * Χρησιμοποιεί το Clipboard API για το Viber λόγω περιορισμών στα URLs.
     */
    const sendMessageToParent = (platform) => {
        const phone = selectedStudent?.parentPhone;
        if (!phone) {
            message.error("Παρακαλώ καταχωρήστε πρώτα το τηλέφωνο γονέα!");
            return;
        }

        const cleanPhone = phone.replace(/\D/g, '');
        const internationalPhone = cleanPhone.startsWith('30') ? cleanPhone : `30${cleanPhone}`;

        // Δημιουργία καθαρού κειμένου
        let text = `Ενημέρωση Βαθμολογίας (${selectedStudent.firstName} ${selectedStudent.lastName}):\n`;
        studentGrades.forEach(g => {
            text += `• ${g.subject}: ${g.value} (${g.term})\n`;
        });

        if (platform === 'whatsapp') {
            const encodedText = encodeURIComponent(text);
            window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
        } else if (platform === 'viber') {
            // 1. ΑΝΤΙΓΡΑΦΗ ΣΤΟ ΠΡΟΧΕΙΡΟ (Clipboard)
            navigator.clipboard.writeText(text).then(() => {
                message.success("Οι βαθμοί αντιγράφηκαν! Κάντε επικόλληση στο Viber.");

                message.info({
                    content: "Οι βαθμοί αντιγράφηκαν! Μόλις ανοίξει το Viber, πατήστε 'Επικόλληση' (Ctrl+V) στο πλαίσιο του μηνύματος.",
                    duration: 5, // Κράτα το μήνυμα λίγο παραπάνω για να προλάβει να το διαβάσει
                    style: { marginTop: '10vh' }
                });
                // 2. ΑΝΟΙΓΜΑ VIBER (χωρίς draft για να μην κολλάει)
                window.location.href = `viber://chat?number=${internationalPhone}`;
            }).catch(err => {
                message.error("Αποτυχία αντιγραφής");
            });
        }
    };

    /**
     * downloadGradesPDF: Δημιουργία και λήψη του επίσημου ελέγχου προόδου σε PDF.
     */
    const downloadGradesPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Φόρτωση γραμματοσειράς για υποστήριξη Ελληνικών
        doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
        doc.setFont("Roboto");

        // Σχεδίαση πλαισίου και κεφαλίδας
        doc.setDrawColor(24, 144, 255);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("ΕΛΛΗΝΙΚΗ ΔΗΜΟΚΡΑΤΙΑ", pageWidth / 2, 15, { align: "center" });

        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text("ΕΛΕΓΧΟΣ ΠΡΟΟΔΟΥ ΜΑΘΗΤΗ", pageWidth / 2, 35, { align: "center" });
        doc.line(60, 38, pageWidth - 60, 38);

        // 3. Στοιχεία Μαθητή
        doc.setFontSize(12);
        doc.text(`Ονοματεπώνυμο: ${selectedStudent?.firstName} ${selectedStudent?.lastName}`, 20, 55);
        doc.text(`Τμήμα: ${classroomName}`, 20, 62);
        doc.text(`Ημερομηνία Έκδοσης: ${new Date().toLocaleDateString('el-GR')}`, 20, 69);

        // 4. Δεδομένα Πίνακα
        const subjects = [...new Set(studentGrades.map(g => g.subject))];
        const currentTableColumn = ["Μάθημα", "Α' Τετρ.", "Β' Τετρ.", "Μ.Ο."];

        const currentTableRows = subjects.map(sub => {
            const gradeA = studentGrades.find(g => g.subject === sub && g.term === "Α' Τετράμηνο")?.value;
            const gradeB = studentGrades.find(g => g.subject === sub && g.term === "Β' Τετράμηνο")?.value;

            let rowAverage = "-";
            if (gradeA !== undefined && gradeB !== undefined) {
                rowAverage = ((gradeA + gradeB) / 2).toFixed(1);
            } else if (gradeA !== undefined) {
                rowAverage = gradeA.toFixed(1);
            }
            return [sub, gradeA ?? "-", gradeB ?? "-", rowAverage];
        });

        autoTable(doc, {
            head: [currentTableColumn],
            body: currentTableRows,
            startY: 80,
            theme: 'grid',
            styles: {
                font: "Roboto",
                fontStyle: 'normal',
                fontSize: 10,
                halign: 'center'
            },
            headStyles: {
                font: "Roboto",
                fontStyle: 'normal',
                fillStyle: [24, 144, 255],
                textColor: 255
            },
            bodyStyles: {
                font: "Roboto",
                fontStyle: 'normal'
            },
            columnStyles: {
                0: {
                    halign: 'left',
                    font: "Roboto",
                    fontStyle: 'normal',
                    cellWidth: 50
                }
            }
        });

        // 6. Οι Υπογραφές (Διευθυντής & Δάσκαλος)
        const footerY = pageHeight - 45;
        doc.setFontSize(11);

        // Αριστερά: Διευθυντής
        doc.text("Ο Διευθυντής / Η Διευθύντρια", 50, footerY, { align: "center" });
        doc.line(25, footerY + 15, 75, footerY + 15);

        // Δεξιά: Δάσκαλος
        doc.text("Ο Διδάσκων / Η Διδάσκουσα", pageWidth - 50, footerY, { align: "center" });
        doc.text(`( ${user?.firstName} ${user?.lastName} )`, pageWidth - 50, footerY + 22, { align: "center" });
        doc.line(pageWidth - 75, footerY + 15, pageWidth - 25, footerY + 15);

        doc.save(`Final_Report_${selectedStudent?.lastName}.pdf`);
    };

    const saveStudentDetails = async () => {
        try {
            await axios.put(`http://localhost:8080/api/students/${selectedStudent.id}/details`, {
                comments: selectedStudent.comments,
                parentPhone: selectedStudent.parentPhone
            });

            setStudents(prev => prev.map(s =>
                s.id === selectedStudent.id ? { ...s, comments: selectedStudent.comments, parentPhone: selectedStudent.parentPhone } : s
            ));

            message.success("Τα στοιχεία του μαθητή ενημερώθηκαν!");
            setIsModalVisible(false);
        } catch (error) {
            message.error("Σφάλμα κατά την αποθήκευση");
        }
    };

    /**
     * handleAttendanceChange: Αλλαγή κατάστασης παρουσίας και έλεγχος ορίου απουσιών.
     */
    const handleAttendanceChange = async (studentId, isPresent) => {
        if (!isPresent) {
            try {
                const res = await axios.get(`http://localhost:8080/api/attendance/count-absences/${studentId}`);
                if (res.data >= 20) {
                    message.error(`Προσοχή! Ο μαθητής έχει ήδη ${res.data} απουσίες!`);
                }
            } catch (error) {
                console.error("Σφάλμα στον έλεγχο απουσιών", error);
            }
        }
        setAttendance(prev => ({ ...prev, [studentId]: isPresent }));
    };

// Trigger φόρτωσης όταν αλλάζει το τμήμα
useEffect(() => {
    const idToLoad = selectedClassroom || classroomId;
    if (idToLoad) fetchData(idToLoad);
}, [selectedClassroom, classroomId, fetchData]);

    const submitAttendance = async () => {
        const activeId = selectedClassroom || (user.classroom ? user.classroom.id : null);

        if (!activeId) {
            message.warning("Δεν βρέθηκε έγκυρο τμήμα για αποθήκευση.");
            return;
        }

        const payload = students.map(s => ({
            student: { id: s.id },
            classroom: { id: activeId }, // <--- ΑΥΤΟ ΠΡΕΠΕΙ ΝΑ ΕΧΕΙ ΤΟ ID
            present: attendance[s.id] === undefined ? true : attendance[s.id],
            date: new Date().toISOString().split('T')[0]
        }));

        try {
            await axios.post('http://localhost:8080/api/attendance/save-batch', payload);
            message.success("Το απουσιολόγιο αποθηκεύτηκε!");
        } catch (error) {
            message.error("Αποτυχία αποθήκευσης");
        }
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
            render: (_, r) =>
                <Switch
                    checked={attendance[r.id]}
                    onChange={(val) => setAttendance(prev => ({...prev, [r.id]: val}))}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />} /> },
        {
            title: 'Επισήμανση',
            render: (_, record) => attendance[record.id] ?
                <Badge status="success" text="Παρόν" /> :
                <Badge status="error" text="Απών" />
        }
    ];


const currentClassName = user.classroom ? user.classroom.name : (allClassrooms.find(c => c.id === selectedClassroom)?.name || "---");

        return (
            <div style={{padding: '20px'}}>
                {/* Επιλογή Τμήματος για Ειδικότητες */}
                {!user.classroom && (
                    <Card style={{marginBottom: 20, borderLeft: '5px solid #1890ff'}}>
                        <Space>
                            <Typography.Text strong>🔍 Επιλογή Τμήματος:</Typography.Text>
                            <Select
                                style={{width: 250}}
                                placeholder="Διαλέξτε τάξη..."
                                onChange={setSelectedClassroom}
                                value={selectedClassroom}
                            >
                                {allClassrooms.map(c => (
                                    <Select.Option key={c.id} value={c.id}>
                                        {c.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Space>
                    </Card>
                )}

                {/* Κύριος Πίνακας Απουσιολογίου */}
                <Card style={{borderRadius: '15px', borderTop: '5px solid #1890ff'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
                        <Title level={3}>📖 Απουσιολόγιο: Τμήμα {currentClassName}</Title>
                        <Button
                            type="primary"
                            icon={<SaveOutlined/>}
                            onClick={submitAttendance}
                            disabled={students.length === 0}
                        >
                            Οριστικοποίηση
                        </Button>
                    </div>
                    <Table
                        dataSource={students}
                        columns={columns}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
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
                <Divider orientation="left">🎓 Καταχώρηση Βαθμολογίας</Divider>
                <Row gutter={12} align="middle"
                     style={{background: '#f0f5ff', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
                    <Col span={7}>
                        <p style={{marginBottom: '5px'}}><b>Μάθημα:</b></p>
                        <Select style={{width: '100%'}} value={selectedSubject} onChange={setSelectedSubject}>
                            <Select.Option value="Μαθηματικά">Μαθηματικά</Select.Option>
                            <Select.Option value="Φυσική">Φυσική</Select.Option>
                            <Select.Option value="Γλώσσα">Γλώσσα</Select.Option>
                            <Select.Option value="Ιστορία">Ιστορία</Select.Option>
                        </Select>
                    </Col>
                    <Col span={7}>
                        <p style={{marginBottom: '5px'}}><b>Τετράμηνο:</b></p>
                        <Select style={{width: '100%'}} value={selectedTerm} onChange={setSelectedTerm}>
                            <Select.Option value="Α' Τετράμηνο">Α' Τετράμηνο</Select.Option>
                            <Select.Option value="Β' Τετράμηνο">Β' Τετράμηνο</Select.Option>
                        </Select>
                    </Col>
                    <Col span={4}>
                        <p style={{marginBottom: '5px'}}><b>Βαθμός:</b></p>
                        <InputNumber min={0} max={20} value={gradeValue} onChange={setGradeValue}
                                     style={{width: '100%'}}/>
                    </Col>
                    <Col span={6} style={{textAlign: 'right', marginTop: '22px'}}>
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined/>}
                            onClick={async () => {
                                // Έλεγχος αν υπάρχει ήδη βαθμός για αυτό το μάθημα και τετράμηνο
                                const alreadyExists = studentGrades.some(g => g.subject === selectedSubject && g.term === selectedTerm);

                                if (alreadyExists) {
                                    message.warning(`Υπάρχει ήδη βαθμός για το μάθημα ${selectedSubject} στο ${selectedTerm}!`);
                                    return;
                                }

                                await onSaveGrade({
                                    value: gradeValue,
                                    subject: selectedSubject,
                                    term: selectedTerm, // <--- Εδώ χρησιμοποιούμε πλέον το state selectedTerm
                                    student: {id: selectedStudent.id}
                                });
                                setGradeValue(0);
                                const res = await axios.get(`http://localhost:8080/api/grades/student/${selectedStudent.id}`);
                                setStudentGrades(res.data);
                                message.success("Ο βαθμός καταχωρήθηκε επιτυχώς!");
                            }}
                        >
                            Εισαγωγή
                        </Button>
                    </Col>
                </Row>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '20px',
                    background: '#fafafa',
                    padding: '10px',
                    borderRadius: '8px'
                }}>

                    <Typography.Text strong style={{fontSize: '16px'}}>
                        📊 Ιστορικό Βαθμολογίας
                    </Typography.Text>

                    <div style={{display: 'flex', gap: '8px'}}>
                        {/* Κουμπί PDF */}
                        <Button
                            size="small"
                            icon={<SaveOutlined/>}
                            onClick={downloadGradesPDF}
                            disabled={studentGrades.length === 0}
                        >
                            PDF
                        </Button>

                        {/* Κουμπί WhatsApp */}
                        <Button
                            size="small"
                            style={{backgroundColor: '#25D366', color: 'white', border: 'none'}}
                            onClick={() => sendMessageToParent('whatsapp')}
                            disabled={studentGrades.length === 0}
                        >
                            WhatsApp
                        </Button>

                        {/* Κουμπί Viber */}
                        <Button
                            size="small"
                            style={{backgroundColor: '#7360f2', color: 'white', border: 'none'}}
                            onClick={() => sendMessageToParent('viber')}
                            disabled={studentGrades.length === 0}
                        >
                            Viber
                        </Button>
                        <div style={{textAlign: 'right', marginTop: '5px'}}>
                            <Typography.Text type="secondary" style={{fontSize: '11px'}}>
                                * Για το Viber απαιτείται Δεξί κλικ -> Επικόλληση στη συνομιλία.
                            </Typography.Text>
                        </div>
                    </div>
                </div>

                <Divider style={{margin: '10px 0'}}/>

                <List
                    size="small"
                    bordered
                    dataSource={studentGrades}
                    renderItem={item => (
                        <List.Item>
                        <b>{item.subject}</b>: <Tag color="blue">{item.value}</Tag>
                            <span style={{fontSize: '12px', color: '#8c8c8c'}}> ({item.term})</span>
                        </List.Item>
                    )}
                    locale={{emptyText: "Δεν υπάρχουν καταχωρημένοι βαθμοί."}}
                    style={{marginBottom: '20px', background: '#fafafa'}}
                />

                <div style={{display: 'flex', gap: '20px', marginBottom: '20px'}}>
                    <div style={{textAlign: 'center', flex: '1'}}>
                        <Progress
                            type="dashboard"
                            percent={Math.min((studentHistory.length / 20) * 100, 100)}
                            format={() => `${studentHistory.length}/20`}
                            status={studentHistory.length >= 20 ? 'exception' : 'normal'}
                            strokeColor={studentHistory.length >= 15 ? '#faad14' : '#52c41a'}
                        />
                        <p><b>Συνολικές Απουσίες</b></p>
                    </div>

                    <div style={{flex: '2'}}>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item
                                label="Αριθμός Μητρώου (ΑΜ)">{selectedStudent?.id + 1000}</Descriptions.Item>
                            <Descriptions.Item label="Τμήμα">{classroomName}</Descriptions.Item>
                            <Descriptions.Item label="Κατάσταση Φοίτησης">
                                <Badge status="success" text="Ενεργός"/>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                <Divider orientation="left">Στοιχεία Επικοινωνίας & Σημειώσεις</Divider>
                <Row gutter={16}>
                    <Col span={12}>
                        <p><b>📞 Τηλέφωνο Γονέα:</b></p>
                        <Input value={selectedStudent?.parentPhone}
                               onChange={(e) => setSelectedStudent({...selectedStudent, parentPhone: e.target.value})}/>
                    </Col>
                    <Col span={12}>
                        <p><b>🏠 Διεύθυνση:</b></p>
                        <Input value={selectedStudent?.address}
                               onChange={(e) => setSelectedStudent({...selectedStudent, address: e.target.value})}/>
                    </Col>
                </Row>

                <div style={{marginTop: '15px'}}>
                    <p><b>📝 Παιδαγωγικές Σημειώσεις:</b></p>
                    <Input.TextArea rows={3} value={selectedStudent?.comments} onChange={(e) => setSelectedStudent({
                        ...selectedStudent,
                        comments: e.target.value
                    })}/>
                </div>

                <Divider orientation="left">Πρόσφατες Απουσίες</Divider>
                <List
                    size="small"
                    bordered
                    dataSource={studentHistory}
                    renderItem={item => (
                        <List.Item style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>📅 {new Date(item.date).toLocaleDateString('el-GR')}</span>
                            <Tag color="red">Απών</Tag>
                        </List.Item>
                    )}
                    style={{maxHeight: 150, overflowY: 'auto'}}
                />
            </Modal>
            </div>
        );
    };

    export default MyClassroom;