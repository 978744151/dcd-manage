import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Card, Input, Form, Select, Tag, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined, CommentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BlogService, Blog as BlogType, CreateBlogData } from '../services/blog.service';

const { confirm } = Modal;
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

const BlogManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogs, setBlogs] = useState<BlogType[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
    const [form] = Form.useForm();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    // 新增：按博客ID搜索的输入状态
    const [blogIdSearch, setBlogIdSearch] = useState('');

    // 获取博客列表
    const fetchBlogs = async (page = 1, limit = 10, search = '') => {
        console.log(blogIdSearch)
        setLoading(true);
        try {
            const params: any = {
                page,
                limit,
                sortByLatest: 'true',
                _id: blogIdSearch

            };
            if (search) {
                params.search = search;
            }
            const response = await BlogService.getBlogs(params);

            if (response.success) {
                setBlogs(response.data.blogs || []);
                setPagination({
                    current: page,
                    pageSize: limit,
                    total: response.data.pagination?.total || 0
                });
            }
        } catch (error) {
            console.error('获取博客列表失败:', error);
            message.error('获取博客列表失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // 搜索处理（标题/内容）
    const handleSearch = (value: string) => {
        setSearchText(value);
        setBlogIdSearch(''); // 清空ID搜索，避免冲突
        fetchBlogs(1, pagination.pageSize, value);
    };

    // 新增：按ID搜索处理
    const handleSearchById = async (value: string) => {
        setBlogIdSearch(value);
        if (value) {
            // 清空ID搜索时回到普通列表
            fetchBlogs(1, pagination.pageSize, searchText);
            return;
        }
        // try {
        //     setLoading(true);
        //     const response = await BlogService.getBlogById(value);
        //     if (response.success && response.data) {
        //         setBlogs([response.data]);
        //         setPagination({ current: 1, pageSize: 10, total: 1 });
        //     } else {
        //         setBlogs([]);
        //         setPagination({ current: 1, pageSize: 10, total: 0 });
        //         message.warning('未找到该ID对应的博客');
        //     }
        // } catch (error: any) {
        //     console.error('按ID获取博客详情失败:', error);
        //     message.error(error.response?.data?.message || '获取博客详情失败');
        // } finally {
        //     setLoading(false);
        // }
    };

    // 分页处理
    const handleTableChange = (paginationInfo: any) => {
        // 如果当前为ID搜索模式，分页固定为单条，不进行列表翻页
        if (blogIdSearch) return;
        fetchBlogs(paginationInfo.current, paginationInfo.pageSize, searchText);
    };

    // 显示新增/编辑模态框
    const showModal = (blog?: BlogType) => {
        setEditingBlog(blog || null);
        setIsModalVisible(true);
        if (blog) {
            form.setFieldsValue({
                title: blog.title,
                content: blog.content
            });
        } else {
            form.resetFields();
        }
    };

    // 关闭模态框
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingBlog(null);
        form.resetFields();
    };

    // 提交表单
    const handleSubmit = async (values: any) => {
        try {
            let response;
            if (editingBlog) {
                // 编辑博客
                response = await BlogService.updateBlog(editingBlog._id, values);
                if (response.success) {
                    message.success('博客更新成功');
                }
            } else {
                // 新增博客
                response = await BlogService.createBlog(values);
                if (response.success) {
                    message.success('博客创建成功');
                }
            }
            setIsModalVisible(false);
            setEditingBlog(null);
            form.resetFields();
            fetchBlogs(pagination.current, pagination.pageSize, searchText);
        } catch (error: any) {
            console.error('操作失败:', error);
            message.error(error.response?.data?.message || '操作失败');
        }
    };

    // 删除博客
    const handleDelete = (blog: BlogType) => {
        confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: `确定要删除博客「${blog.title}」吗？此操作无法撤销。`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    const response = await BlogService.deleteBlog(blog._id);
                    if (response.success) {
                        message.success('博客删除成功');
                        fetchBlogs(pagination.current, pagination.pageSize, searchText);
                    }
                } catch (error: any) {
                    console.error('删除失败:', error);
                    message.error(error.response?.data?.message || '删除失败');
                }
            },
        });
    };

    // 查看博客详情
    const handleView = (blog: BlogType) => {
        Modal.info({
            title: blog.title,
            width: 800,
            content: (
                <div>
                    <p><strong>作者：</strong>{blog.user?.username || '未知用户'}</p>
                    <p><strong>创建时间：</strong>{new Date(blog.createdAt).toLocaleString()}</p>
                    <p><strong>评论数：</strong>{blog.commentCount}</p>
                    <p><strong>点赞数：</strong>{blog.likeCount}</p>
                    {blog.defaultImage && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>封面图片：</strong>
                            <br />
                            <Image src={blog.defaultImage} alt="封面" style={{ maxWidth: 200 }} />
                        </div>
                    )}
                    <div>
                        <strong>内容：</strong>
                        <div style={{
                            marginTop: 8,
                            padding: 12,
                            backgroundColor: '#f5f5f5',
                            borderRadius: 4,
                            maxHeight: 300,
                            overflow: 'auto'
                        }}>
                            {blog.content}
                        </div>
                    </div>
                </div>
            ),
        });
    };

    // 跳转到评论管理页面
    const handleCommentManagement = (blog: BlogType) => {
        navigate(`/admin/comments?blogId=${blog._id}&blogTitle=${encodeURIComponent(blog.title)}`);
    };

    // 表格列定义
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            width: 100,
            ellipsis: true,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
            ellipsis: true,
        },
        {
            title: '作者',
            key: 'author',
            width: 120,
            render: (_: any, record: BlogType) => (
                <span>{record.user?.username || '未知用户'}</span>
            ),
        },
        {
            title: '封面',
            key: 'image',
            width: 80,
            render: (_: any, record: BlogType) => (
                record.defaultImage ? (
                    <Image
                        src={record.defaultImage}
                        alt="封面"
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <span>无</span>
                )
            ),
        },
        {
            title: '评论数',
            dataIndex: 'commentCount',
            key: 'commentCount',
            width: 80,
            sorter: (a: BlogType, b: BlogType) => (a.commentCount || 0) - (b.commentCount || 0),
        },
        {
            title: '点赞数',
            dataIndex: 'likeCount',
            key: 'likeCount',
            width: 80,
            sorter: (a: BlogType, b: BlogType) => (a.likeCount || 0) - (b.likeCount || 0),
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date: string) => new Date(date).toLocaleString(),
            sorter: (a: BlogType, b: BlogType) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: '操作',
            key: 'action',
            width: 200,
            render: (_: any, record: BlogType) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleView(record)}
                    >
                        查看
                    </Button>
                    <Button
                        icon={<CommentOutlined />}
                        size="small"
                        onClick={() => handleCommentManagement(record)}
                    >
                        评论管理
                    </Button>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => showModal(record)}
                    >
                        编辑
                    </Button>
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={() => handleDelete(record)}
                    >
                        删除
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h2>博客管理</h2>
            </div>

            <Card className="card-container">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space>
                            <Search
                                placeholder="搜索博客标题或内容"
                                onSearch={handleSearch}
                                style={{ width: 300 }}
                                allowClear
                            />
                            {/* 新增：按博客ID搜索 */}
                            <Search
                                placeholder="按博客ID搜索"
                                onSearch={handleSearchById}
                                style={{ width: 260 }}
                                allowClear
                            />
                        </Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                        >
                            新增博客
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={blogs}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
                        }}
                        onChange={handleTableChange}
                        scroll={{ x: 1200 }}
                    />
                </Space>
            </Card>

            {/* 新增/编辑模态框 */}
            <Modal
                title={editingBlog ? '编辑博客' : '新增博客'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={800}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[
                            { required: true, message: '请输入博客标题' },
                            { max: 100, message: '标题不能超过100个字符' }
                        ]}
                    >
                        <Input placeholder="请输入博客标题" />
                    </Form.Item>

                    <Form.Item
                        name="content"
                        label="内容"
                        rules={[
                            // { required: true, message: '请输入博客内容' },
                        ]}
                    >
                        <TextArea
                            rows={10}
                            placeholder="请输入博客内容"
                            showCount
                            maxLength={5000}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingBlog ? '更新' : '创建'}
                            </Button>
                            <Button onClick={handleCancel}>
                                取消
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default BlogManagement;