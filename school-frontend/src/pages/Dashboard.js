import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Divider, List, Badge } from 'antd';
import { UserOutlined, TeamOutlined, BankOutlined, WarningOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const { Title } = Typography;

/**
 * Component: Dashboard
 * Σκοπός: Παρέχει μια συνολική εικόνα της κατάστασης του σχολείου.
 * Διαθέτει δύο όψεις:
 * 1. Admin View: Γενικά στατιστικά και γραφήματα για όλο το σχολείο.
 * 2. Teacher View: Συγκεκριμένα στατιστικά για το τμήμα του δασκάλου και λίστα μαθητών σε κίνδυνο (όριο απουσιών).
 */
const Dashboard = ({ user }) => {
    // States για στατιστικά, γραφήματα και λίστες προειδοποιήσεων
    const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClassrooms: 0, absentToday: 0, criticalStudents: 0 });
    const [chartData, setChartData] = useState([]);
    const [criticalStudentsList, setCriticalStudentsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Έλεγχος δικαιωμάτων βάσει του ρόλου που έρχεται από το Backend
    const isAdmin = user?.role === 'ADMIN';

    /**
     * useEffect Hook: Ανάκτηση δεδομένων κατά τη φόρτωση.
     * Χρησιμοποιεί Promise.all για παράλληλες κλήσεις API στον Admin, βελτιώνοντας την ταχύτητα.
     */
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (isAdmin) {
                    // Λογική ADMIN: Συγκέντρωση δεδομένων από όλο το σύστημα
                    const [resS, resT, resC] = await Promise.all([
                        axios.get('http://localhost:8080/api/students'),
                        axios.get('http://localhost:8080/api/teachers'),
                        axios.get('http://localhost:8080/api/classrooms')
                    ]);

                    setStats({
                        totalStudents: resS.data.length,
                        totalTeachers: resT.data.length,
                        totalClassrooms: resC.data.length
                    });

                    // Διαμόρφωση δεδομένων για το BarChart (Recharts)
                    const data = resC.data.map(c => ({
                        name: c.name,
                        μαθητές: c.students?.length || 0
                    }));
                    setChartData(data);
                } else {
                    // Λογική TEACHER: Εστίαση στο συγκεκριμένο τμήμα του εκπαιδευτικού
                    const res = await axios.get(`http://localhost:8080/api/attendance/teacher-stats/${user.classroom?.id}`);
                    setStats({
                        totalStudents: res.data.totalStudents,
                        absentToday: res.data.absentToday,
                        criticalStudents: res.data.criticalStudents || 0
                    });

                    // Ανάκτηση μαθητών που πλησιάζουν το όριο απουσιών (>20)
                    const resCritical = await axios.get(`http://localhost:8080/api/attendance/critical-students/${user.classroom?.id}`);
                    setCriticalStudentsList(resCritical.data);
                }
            } catch (error) {
                console.error("Dashboard data fetching error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [user, isAdmin]);

    // Εμφάνιση Spinner κατά τη διάρκεια της φόρτωσης των δεδομένων
    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <div style={{ padding: '20px' }}>
            {/* Δυναμικός Τίτλος βάσει Ρόλου */}
            <Title level={2}>
                {isAdmin ? "📊 Γενική Εικόνα Σχολείου" : `🏫 Πίνακας Ελέγχου: Τμήμα ${user.classroom?.name}`}
            </Title>
            <Divider />

            {/* Πάνελ Στατιστικών (Cards) */}
            <Row gutter={16}>
                {isAdmin ? (
                    <>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Συνολικοί Μαθητές" value={stats.totalStudents} prefix={<UserOutlined />} valueStyle={{ color: '#3f8600' }} /></Card></Col>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Εκπαιδευτικοί" value={stats.totalTeachers} prefix={<TeamOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Τμήματα" value={stats.totalClassrooms} prefix={<BankOutlined />} /></Card></Col>
                    </>
                ) : (
                    <>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Μαθητές Τμήματος" value={stats.totalStudents} prefix={<UserOutlined />} /></Card></Col>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Απόντες Σήμερα" value={stats.absentToday} prefix={<WarningOutlined />} valueStyle={{ color: '#cf1322' }} /></Card></Col>
                        <Col span={8}><Card bordered={false} hoverable><Statistic title="Στο Όριο (>20)" value={criticalStudentsList.length} prefix={<WarningOutlined />} valueStyle={{ color: '#faad14' }} /></Card></Col>
                    </>
                )}
            </Row>

            {/* Λίστα Προειδοποίησης (Μόνο για Δασκάλους) */}
            {!isAdmin && (
                <Row gutter={16} style={{ marginTop: '20px' }}>
                    <Col span={24}>
                        <Card title={<><WarningOutlined style={{ color: 'red' }} /> Μαθητές σε κίνδυνο (Όριο Απουσιών)</>} bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={criticalStudentsList}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={`Συνολικές απουσίες: ${item.absences}`}
                                        />
                                        <Badge
                                            count={item.absences}
                                            overflowCount={99}
                                            style={{ backgroundColor: item.absences >= 20 ? '#f5222d' : '#faad14' }}
                                        />
                                    </List.Item>
                                )}
                                locale={{ emptyText: "Κανένας μαθητής δεν πλησιάζει το όριο." }}
                            />
                        </Card>
                    </Col>
                </Row>
            )}

            {/* Γράφημα Κατανομής (Μόνο για Admin) */}
            {isAdmin && (
                <Card title="📊 Κατανομή Μαθητών ανά Τμήμα" style={{ marginTop: '20px' }}>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="μαθητές" fill="#1890ff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;