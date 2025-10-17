import api from './auth';

export const CommentService = {
    // Create a new comment
    createComment: async (blogId, content) => {
        const response = await api.post('/comments/create', { blogId, content });
        return response.data;
    },

    // Reply to a comment
    replyToComment: async (commentId, content, replyTo) => {
        const response = await api.post('/comment/reply', {
            commentId,
            content,
            replyTo
        });
        return response.data;
    },

    // Get all comments for a blog
    getBlogComments: async (blogId, commentId?: string) => {
        const response = await api.get('/comment', { params: { blogId, commentId } });
        return response.data;
    },

    // Delete a comment
    deleteComment: async (commentId) => {
        const response = await api.post(`/comment/delete/${commentId}`);
        return response.data;
    },

    // Like or unlike a comment
    likeComment: async (commentId) => {
        const response = await api.post('/comment/like', { commentId });
        return response.data;
    },

    // 根据评论ID获取评论详情（包含关联博客信息）
    getCommentDetail: async (id: string): Promise<any> => {
        const response = await api.get('/comment/detail', { params: { id } });
        return response.data;
    },
};

export default CommentService;