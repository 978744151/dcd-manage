import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Card, Select, Input, Tag } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import api from '../services/auth';
import CommentService from '../services/comment.service';

const { confirm } = Modal;
const { Option } = Select;
const { Search } = Input;

const CommentList = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    // 新增：按评论ID搜索的状态
    const [commentIdSearch, setCommentIdSearch] = useState('');

    // 初始化URL参数
    useEffect(() => {
        const blogId = searchParams.get('blogId');
        const commentId = searchParams.get('commentId');
        const title = searchParams.get('blogTitle');

        if (blogId) {
            setSelectedBlog(blogId);
        }
        if (commentId) {
            console.log(124, commentId);
            setCommentIdSearch(commentId)
        }
        if (title) {
            setBlogTitle(decodeURIComponent(title));
        }
    }, [searchParams]);

    // Fetch blogs and comments
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch blogs
                const blogResponse = await api.get('/blogs/all');
                console.log(blogResponse.data.data.blogs); // Debugging printout for blog informatio  
                setBlogs(blogResponse.data.data.blogs || []);

                // If a blog is selected, fetch its comments
                if (selectedBlog) {
                    console.log(selectedBlog);
                    const commentResponse = await CommentService.getBlogComments(selectedBlog, commentIdSearch);
                    let commentList = commentResponse.data.comment || [];

                    // Apply search filter if any
                    if (searchText) {
                        commentList = commentList.filter(comment =>
                            comment.content.toLowerCase().includes(searchText.toLowerCase())
                        );
                    }

                    setComments(commentList);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('获取数据失败');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedBlog, searchText, commentIdSearch]);

    // Handle blog selection change
    const handleBlogChange = (value) => {
        setSelectedBlog(value);
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
        setCommentIdSearch(''); // 清空ID搜索，避免冲突
    };

    // 新增：按评论ID搜索
    const handleSearchByCommentId = async (value: string) => {
        setCommentIdSearch(value);
        // 清空ID搜索，恢复当前选中博客的评论列表
        if (selectedBlog) {
            const response = await CommentService.getBlogComments(selectedBlog);
            setComments(response.data.comment || []);
        } else {
            setComments([]);
        }
        return;
        // try {
        //     setLoading(true);
        //     const detail = await CommentService.getCommentDetail(value);
        //     const comment = detail?.data; // 后端返回 { success, data }
        //     if (comment) {
        //         // 如果选择了博客，且该评论属于同一博客，则只显示该评论；否则也显示该评论（管理员定位用）
        //         if (!selectedBlog || (comment.blog?._id || comment.blog) === selectedBlog) {
        //             setComments([comment]);
        //         } else {
        //             setComments([comment]);
        //             message.info('该评论不属于当前选择的博客，已单独显示该条。');
        //         }
        //     } else {
        //         setComments([]);
        //         message.warning('未找到该ID对应的评论');
        //     }
        // } catch (error: any) {
        //     console.error('按ID获取评论详情失败:', error);
        //     message.error(error.response?.data?.message || '获取评论详情失败');
        // } finally {
        //     setLoading(false);
        // }
    };

    // Handle comment deletion
    const handleDelete = (id) => {
        confirm({
            title: '确认删除',
            icon: <ExclamationCircleOutlined />,
            content: '确定要删除这条评论吗？此操作无法撤销，并将删除该评论下的所有回复。',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                try {
                    await CommentService.deleteComment(id);
                    message.success('评论删除成功');

                    // Refresh comments
                    if (selectedBlog) {
                        const response = await CommentService.getBlogComments(selectedBlog);
                        console.log(response);
                        setComments(response.data.comment || []);
                    }
                } catch (error) {
                    message.error('删除失败: ' + (error.response?.data?.message || '未知错误'));
                }
            },
        });
    };

    // Table columns
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            width: '100px',
        },
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            render: (text) => <div style={{ maxWidth: '400px', wordWrap: 'break-word' }}>{text}</div>,
        },
        {
            title: '用户',
            key: 'user',
            render: (_, record) => (
                <span>{record.user?.name || record.fromUserName || '未知用户'}</span>
            ),
        },
        {
            title: '回复给',
            key: 'replyTo',
            render: (_, record) => (
                record.replyTo ? (
                    <span>{record.toUserName || '用户'}</span>
                ) : (
                    <Tag color="green">主评论</Tag>
                )
            ),
        },
        {
            title: '点赞数',
            dataIndex: 'likeCount',
            key: 'likeCount',
            sorter: (a: any, b: any) => (a.likeCount || 0) - (b.likeCount || 0),
        },
        {
            title: '时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
            sorter: (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDelete(record._id)}
                >
                    删除
                </Button>
            ),
        },
    ];

    // Columns for replies
    const replyColumns = [
        {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            render: (text) => <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>{text}</div>,
        },
        {
            title: '用户',
            key: 'user',
            render: (_, record) => (
                <span>{record.user?.name || record.fromUserName || '未知用户'}</span>
            ),
        },
        {
            title: '回复给',
            key: 'replyTo',
            render: (_, record) => (
                <span>{record.toUserName || '用户'}</span>
            ),
        },
        {
            title: '点赞数',
            dataIndex: 'likeCount',
            key: 'likeCount',
        },
        {
            title: '时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: '操作',
            key: 'action',
            width: '100px',
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handleDelete(record._id)}
                >
                    删除
                </Button>
            ),
        },
    ];

    // Expandable row for replies
    const expandedRowRender = (record) => {
        const replies = record.replies || [];
        return (
            <Card title="回复列表" size="small" bordered={false}>
                <Table
                    columns={replyColumns}
                    dataSource={replies}
                    rowKey="_id"
                    pagination={false}
                    size="small"
                />
            </Card>
        );
    };

    return (
        <div>
            <div className="page-header">
                <h2>评论管理</h2>
            </div>

            <Card className="card-container">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <span>选择博客:</span>
                            <Select
                                style={{ width: 300, marginLeft: 8 }}
                                placeholder="选择要查看评论的博客"
                                allowClear
                                onChange={handleBlogChange}
                                value={selectedBlog}
                            >
                                {blogs.map(blog => (
                                    <Option key={blog._id} value={blog._id}>
                                        {blog.title}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ flex: 1, display: 'flex', gap: 12 }}>
                            <Search
                                placeholder="搜索评论内容"
                                onSearch={handleSearch}
                                style={{ width: 300 }}
                                allowClear
                            />
                            {/* 新增：按评论ID搜索 */}
                            <Search
                                value={commentIdSearch}
                                placeholder="按评论ID搜索"
                                onSearch={handleSearchByCommentId}
                                style={{ width: 240 }}
                                allowClear
                            />
                        </div>
                    </div>

                    {selectedBlog ? (
                        <Table
                            columns={columns}
                            dataSource={comments}
                            rowKey="_id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            expandable={{
                                expandedRowRender,
                                rowExpandable: record => (record.replies && record.replies.length > 0),
                            }}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            请选择一个博客来查看评论
                        </div>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default CommentList;