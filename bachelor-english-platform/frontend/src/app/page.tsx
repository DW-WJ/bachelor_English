'use client'

import { Button, Card, Row, Col, Typography, Space, Divider } from 'antd'
import { BookOutlined, ReadOutlined, EditOutlined, TranslationOutlined, TrophyOutlined } from '@ant-design/icons'
import Link from 'next/link'

const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 头部 */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOutlined className="text-2xl text-blue-600 mr-2" />
              <Title level={3} className="!mb-0 text-blue-600">
                学位英语学习平台
              </Title>
            </div>
            <Space>
              <Link href="/login">
                <Button type="text">登录</Button>
              </Link>
              <Link href="/register">
                <Button type="primary">注册</Button>
              </Link>
            </Space>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 欢迎区域 */}
        <div className="text-center mb-16">
          <Title level={1} className="!text-4xl md:!text-6xl !mb-6">
            掌握学位英语
            <br />
            <span className="text-blue-600">从这里开始</span>
          </Title>
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            专业的学位英语考试学习平台，提供词汇、语法、阅读、写作、翻译等全方位学习体验，
            助您轻松通过学位英语考试。
          </Paragraph>
          <Space size="large">
            <Button type="primary" size="large" className="h-12 px-8">
              开始学习
            </Button>
            <Button size="large" className="h-12 px-8">
              了解更多
            </Button>
          </Space>
        </div>

        {/* 学习模块 */}
        <div className="mb-16">
          <Title level={2} className="text-center !mb-12">
            学习模块
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-blue-50">
                    <BookOutlined className="text-4xl text-blue-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="词汇学习"
                  description="掌握核心词汇，提升词汇量，通过交互式学习方式快速记忆单词"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始学习
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-green-50">
                    <EditOutlined className="text-4xl text-green-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="语法学习"
                  description="系统学习英语语法，掌握时态、语态、从句等核心语法知识"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始学习
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-purple-50">
                    <ReadOutlined className="text-4xl text-purple-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="阅读理解"
                  description="提升阅读理解能力，掌握阅读技巧，提高阅读速度和准确率"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始学习
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-orange-50">
                    <EditOutlined className="text-4xl text-orange-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="写作练习"
                  description="提升英语写作水平，学习写作技巧，掌握各种文体写作方法"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始学习
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-red-50">
                    <TranslationOutlined className="text-4xl text-red-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="翻译练习"
                  description="中英翻译练习，提升翻译能力，掌握翻译技巧和方法"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始学习
                  </Button>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                className="h-full text-center"
                cover={
                  <div className="p-8 bg-yellow-50">
                    <TrophyOutlined className="text-4xl text-yellow-600" />
                  </div>
                }
              >
                <Card.Meta
                  title="模拟测试"
                  description="全真模拟考试，检验学习成果，熟悉考试流程和题型"
                />
                <div className="mt-4">
                  <Button type="primary" block>
                    开始测试
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 特色功能 */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Title level={2} className="text-center !mb-8">
            平台特色
          </Title>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOutlined className="text-2xl text-blue-600" />
                </div>
                <Title level={4}>个性化学习</Title>
                <Paragraph className="text-gray-600">
                  AI驱动的个性化学习路径，根据您的学习进度和能力推荐最适合的学习内容
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrophyOutlined className="text-2xl text-green-600" />
                </div>
                <Title level={4}>游戏化学习</Title>
                <Paragraph className="text-gray-600">
                  积分、徽章、排行榜等游戏化元素，让学习变得更有趣和激励性
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ReadOutlined className="text-2xl text-purple-600" />
                </div>
                <Title level={4}>实时反馈</Title>
                <Paragraph className="text-gray-600">
                  即时学习反馈和进度跟踪，帮助您了解学习效果并及时调整学习策略
                </Paragraph>
              </div>
            </Col>
          </Row>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Title level={4} className="!text-white !mb-2">
              学位英语在线学习平台
            </Title>
            <Paragraph className="text-gray-400 !mb-0">
              © 2025 学位英语学习平台. 保留所有权利.
            </Paragraph>
          </div>
        </div>
      </footer>
    </div>
  )
}