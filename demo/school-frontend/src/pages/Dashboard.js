import React, { useEffect, useState } from 'react';
// Προσθήκη List και Badge στο import
import { Row, Col, Card, Statistic, Spin, Typography, Divider, List, Badge } from 'antd';
import { UserOutlined, TeamOutlined, BankOutlined, WarningOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import axios from 'axios';

const { Title } = Typography;

const Dashboard = ({ user }) => {
    const [stats, setStats] = useState({ totalStudents: 0, totalTeachers: 0, totalClassrooms: 0, absentToday: 0, criticalStudents: 0 });
    const [chartData, setChartData] = useState([]);
    // Προσθήκη state για τη λίστα των κρίσιμων μαθητών
    const [criticalStudentsList, setCriticalStudentsList] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (isAdmin) {
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
                    const data = resC.data.map(c => ({ name: c.name, μαθητές: c.students?.length || 0 }));
                    setChartData(data);
                } else {
                    // Φέρνουμε τα βασικά στατιστικά
                    const res = await axios.get(`http://localhost:8080/api/attendance/teacher-stats/${user.classroom?.id}`);
                    setStats({
                        totalStudents: res.data.totalStudents,
                        absentToday: res.data.absentToday,
                        criticalStudents: res.data.criticalStudents || 0
                    });

                    // Φέρνουμε τη λίστα των μαθητών σε κίνδυνο
                    const resCritical = await axios.get(`http://localhost:8080/api/attendance/critical-students/${user.classroom?.id}`);
                    setCriticalStudentsList(resCritical.data);
                }
            } catch (error) {
                console.error("Dashboard error:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, [user, isAdmin]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}><Spin size="large" /></div>;

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>
                {isAdmin ? "📊 Γενική Εικόνα Σχολείου" : `🏫 Πίνακας Ελέγχου: Τμήμα ${user.classroom?.name}`}
            </Title>
            <Divider />

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

            {isAdmin && (
                <Card title="📊 Κατανομή Μαθητών ανά Τμήμα" style={{ marginTop: '20px' }}>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="μαθητές" fill="#1890ff" /></BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;