import api from './auth';

export interface Blog {
  _id: string;
  title: string;
  content: string;
  summary?: string;
  type: '推荐' | '最新' | '关注';
  description?: string;
  blogImage: { image: string }[];
  weeks?: string;
  tuition?: string;
  createdAt: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    avatar?: string;
  };
  commentCount: number;
  likeCount: number;
  createName: string;
  images: string[];
  defaultImage?: string;
}

export interface BlogListResponse {
  success: boolean;
  data: {
    blogs: Blog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface BlogResponse {
  success: boolean;
  data: Blog;
  message?: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  summary?: string;
  type?: '推荐' | '最新' | '关注';
  description?: string;
  blogImage?: { image: string }[];
  weeks?: string;
  tuition?: string;
}

export const BlogService = {
  // 获取博客列表
  async getBlogs(params?: {
    page?: number;
    limit?: number;
    sortByLatest?: boolean;
    search?: string;
    userId?: string;
    _id: string;
  }): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortByLatest) queryParams.append('sortByLatest', 'true');
    if (params?.search) queryParams.append('search', params.search);
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?._id) queryParams.append('_id', params._id);
    console.log(params)
    const response = await api.get(`/blogs/all?${queryParams.toString()}`);
    return response.data;
  },

  // 根据ID获取博客详情
  async getBlogById(id: string): Promise<BlogResponse> {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  // 创建博客
  async createBlog(data: CreateBlogData): Promise<BlogResponse> {
    const response = await api.post('/blogs', data);
    return response.data;
  },

  // 更新博客
  async updateBlog(id: string, data: Partial<CreateBlogData>): Promise<BlogResponse> {
    const response = await api.put(`/blogs/${id}`, data);
    return response.data;
  },

  // 删除博客
  async deleteBlog(id: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  },

  // 获取博客的评论列表
  async getBlogComments(id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/blogs/${id}/comments?${queryParams.toString()}`);
    return response.data;
  }
};