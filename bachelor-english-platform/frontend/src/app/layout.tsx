import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '学位英语在线学习平台',
  description: '专业的学位英语考试学习平台，提供词汇、语法、阅读、写作、翻译等全方位学习体验',
  keywords: ['学位英语', '英语学习', '在线教育', '考试准备'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            locale={zhCN}
            theme={{
              token: {
                colorPrimary: '#1890ff',
                borderRadius: 6,
                fontSize: 14,
              },
              components: {
                Button: {
                  borderRadius: 6,
                },
                Card: {
                  borderRadius: 8,
                },
                Input: {
                  borderRadius: 6,
                },
              },
            }}
          >
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}