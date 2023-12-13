import React from 'react'
import './teacher-detail-student.scss'
import LayoutHomeList from '../../../components/layouts/mainLayout'
import { Breadcrumb, Col, Row } from 'antd'
import imgAvatar from '../../../assets/images/AvatarDefault.png'


export default function TeacherDetailStudent() {
    return (
        <LayoutHomeList
            content={
                <div className='teacher-detail-student'>
                    <Breadcrumb
                        style={{
                            margin: "16px 0"
                        }}
                    >
                        <Breadcrumb.Item>Vật lí 10 - 00VL10</Breadcrumb.Item>
                        <Breadcrumb.Item>Danh sách học sinh trong lớp</Breadcrumb.Item>
                        <Breadcrumb.Item>Nguyen Van A</Breadcrumb.Item>
                    </Breadcrumb>
                    <h2 className='title-detail'>Thông tin tài khoản</h2>
                    <Row className='detail-student'>
                        <Col span={6}>
                            <div className='student-avatar'>
                                <img className='avatar-img' src={imgAvatar} alt="detail-student-avatar" />
                            </div>
                        </Col>
                        <Col span={10}>
                            <div className='student-infor'>
                                <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 24 }]} justify="space-around">
                                    <Col span={10}><h3>Họ và tên:</h3></Col>
                                    <Col span={10}><strong>Nguyen Van A</strong></Col>
                                    {/* ----- */}
                                    <Col span={10}><h3>Ngày sinh:</h3></Col>
                                    <Col span={10}><strong>04/12.2005</strong></Col>
                                    {/* ----- */}
                                    <Col span={10}><h3>Giới tính:</h3></Col>
                                    <Col span={10}><strong>Nam</strong></Col>
                                    {/* ----- */}
                                    <Col span={10}><h3>Email:</h3></Col>
                                    <Col span={10}><strong>nguyenvanA123@gmail</strong></Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <h2 className='title-detail'>Hoạt động</h2>
                    <div className='detail-student'>
                        <Row gutter={[16, { xs: 8, sm: 16, md: 24, lg: 24 }]} justify="space-around">
                            <Col span={7}><h3>Tổng số bình luận:</h3></Col>
                            <Col span={16}><strong>10</strong></Col>
                            {/* ----- */}
                            <Col span={7}><h3>Số bài lab đã hoàn thành:</h3></Col>
                            <Col span={16}><strong>20</strong></Col>
                            {/* ----- */}
                            <Col span={7}><h3>Số bài lab chưa hoàn thành:</h3></Col>
                            <Col span={16}><strong>3</strong></Col>
                            {/* ----- */}
                            <Col span={7}><h3>Số lần đạt được câu trả lời tốt nhất:</h3></Col>
                            <Col span={16}><strong>2</strong></Col>
                        </Row>
                    </div>
                </div>
            }
        />
    )
}
