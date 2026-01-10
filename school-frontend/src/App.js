import React, { useState } from 'react';
import { Layout, Menu, Button, ConfigProvider } from 'antd';
import {
    UserOutlined,
    ApartmentOutlined,
    LogoutOutlined,
    BankOutlined,
    IdcardOutlined,
    TeamOutlined,
    DashboardOutlined,
    BookOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { Typography, Space, Divider, Modal, Tag, Avatar } from 'antd';
import { InfoCircleOutlined, GithubOutlined, CheckCircleOutlined } from '@ant-design/icons';
import StudentList from './pages/StudentList';
import ClassroomList from './pages/ClassroomList';
import Login from './pages/Login';
import axios from 'axios';
import UserProfile from './pages/UserProfile';
import TeacherList from './pages/TeacherList';
import Dashboard from './pages/Dashboard';
import MyClassroom from './pages/MyClassroom';
import AttendanceHistory from './pages/AttendanceHistory';

axios.defaults.withCredentials = true;

const { Header, Content, Sider } = Layout;

function App() {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [isAboutVisible, setIsAboutVisible] = useState(false);

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('students');
    };

    const handleLoginSuccess = async (userData) => {
        try {
            // Καλούμε το /me για να πάρουμε τα πλήρη στοιχεία (π.χ. το classroom του δασκάλου)
            const res = await axios.get('http://localhost:8080/api/auth/me');
            setUser(res.data);

            setCurrentPage('dashboard');
        } catch (error) {
            console.error("Error fetching full user profile:", error);
            // Αν αποτύχει το /me, κρατάμε τουλάχιστον τα βασικά στοιχεία από το login
            setUser(userData);
        }
    };

    if (!user) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <ConfigProvider>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider breakpoint="lg" collapsedWidth="0">
                    <div style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        background: '#002140'
                    }}>
                        <BankOutlined style={{ marginRight: 8 }} /> SCHOOL APP
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[currentPage]}
                        onClick={(e) => setCurrentPage(e.key)}
                    >
                        {/* Κοινή επιλογή για όλους */}
                        <Menu.Item key="dashboard" icon={<DashboardOutlined />}>Dashboard</Menu.Item>

                        {/* Επιλογές ΜΟΝΟ για ADMIN */}
                        {user.role === 'ADMIN' && (
                            <>
                                <Menu.Item key="students" icon={<UserOutlined />}>
                                    Μαθητές
                                </Menu.Item>
                                <Menu.Item key="classrooms" icon={<ApartmentOutlined />}>
                                    Τμήματα
                                </Menu.Item>
                                <Menu.Item key="teachers" icon={<TeamOutlined />}>
                                    Εκπαιδευτικοί
                                </Menu.Item>
                            </>
                        )}

                        {user.role && user.role.includes('TEACHER') && (
                            <>
                                <Menu.Item key="myClassroom" icon={<BookOutlined />}>
                                    Το Τμήμα μου
                                </Menu.Item>
                                <Menu.Item key="attendanceHistory" icon={<HistoryOutlined />}>
                                    Ιστορικό Απουσιών
                                </Menu.Item>
                            </>
                        )}

                        {/* Κοινή επιλογή για όλους */}
                        <Menu.Item key="profile" icon={<IdcardOutlined />}>
                            Το Προφίλ μου
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout>
                    <Header style={{
                        background: '#fff',
                        padding: '0 24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', // Πιο απαλή σκιά
                        zIndex: 1 // Για να φαίνεται πάνω από το content
                    }}>
                        <span>👋 Καλώς ήρθατε, <b>{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}</b></span>
                        <Button
                            type="primary"
                            danger
                            icon={<LogoutOutlined/>}
                            onClick={handleLogout}
                        >
                            Αποσύνδεση
                        </Button>
                    </Header>

                    {/* Προσθήκη overflow: 'initial' για να δουλεύει σωστά το scrolling */}
                    <Content style={{
                        margin: '24px 16px 0',
                        padding: 24,
                        background: '#fff',
                        borderRadius: '8px',
                        minHeight: 'calc(100vh - 170px)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                    }}>
                        {currentPage === 'dashboard' && <Dashboard user={user} />}
                        {currentPage === 'students' && <StudentList userRole={user.role} />}
                        {currentPage === 'classrooms' && <ClassroomList />}
                        {currentPage === 'profile' && <UserProfile user={user} />}
                        {currentPage === 'teachers' && <TeacherList userRole={user.role} />}
                        {currentPage === 'myClassroom' && (
                            <MyClassroom
                                teacherId={user.id}
                                classroomId={user.classroom?.id}
                                classroomName={user.classroom?.name}
                            />
                        )}
                        {currentPage === 'attendanceHistory' && (
                            <AttendanceHistory classroomId={user.classroom?.id} />
                        )}
                    </Content>

                    <Layout.Footer style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Space direction="vertical" size={0}>
                            <Typography.Text strong>© {new Date().getFullYear()} School Management System</Typography.Text>
                            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                                Development: Eleni Sidiraki | MSc in Applied Informatics
                            </Typography.Text>
                        </Space>
                    </Layout.Footer>
                </Layout>

                <Button
                    type="text"
                    icon={<InfoCircleOutlined style={{ fontSize: '16px', color: '#bfbfbf' }} />}
                    onClick={() => setIsAboutVisible(true)}
                    style={{
                        position: 'fixed',
                        bottom: '15px',
                        right: '15px',
                        zIndex: 1000,
                        padding: 0,
                        height: 'auto',
                        width: 'auto'
                    }}
                />
                <Modal
                    title="Σχετικά με την Εφαρμογή"
                    open={isAboutVisible}
                    onCancel={() => setIsAboutVisible(false)}
                    footer={null}
                    centered
                >
                    <div style={{ textAlign: 'center' }}>
                        <Avatar
                            size={80}
                            icon={<BankOutlined />}
                            style={{
                                backgroundColor: '#1890ff',
                                marginBottom: 15,
                                boxShadow: '0 4px 10px rgba(24,144,255,0.2)'
                            }}
                        />
                        <Typography.Title level={4} style={{ marginBottom: 0 }}>
                            School Attendance & Management System
                        </Typography.Title>
                        <Typography.Text strong>Ελένη Σιδηράκη</Typography.Text>
                        <p style={{ margin: 0 }}>
                            <Typography.Text type="secondary">MSc in Applied Informatics</Typography.Text>
                        </p>

                        <Divider></Divider>

                        <Space wrap style={{ justifyContent: 'center' }}>
                            <Tag color="blue">Spring Boot</Tag>
                            <Tag color="cyan">React.js</Tag>
                            <Tag color="orange">MySQL</Tag>
                            <Tag color="purple">Spring Security</Tag>
                        </Space>
                    </div>
                </Modal>
            </Layout>
        </ConfigProvider>
    );
}

export default App;