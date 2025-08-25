import React, { useState } from 'react';
import { Upload, Button, message, Image } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface ImageUploadProps {
    value?: string;
    onChange?: (url: string | undefined) => void;
    maxSize?: number; // MB
    accept?: string;
    placeholder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    maxSize = 5,
    accept = 'image/*',
    placeholder = '上传图片'
}) => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | undefined>(value);
    const [fullUrl, setFullUrl] = useState<string | undefined>(value);

    React.useEffect(() => {
        setImageUrl(value);
    }, [value]);

    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件!');
            return false;
        }
        const isLtMaxSize = file.size / 1024 / 1024 < maxSize;
        if (!isLtMaxSize) {
            message.error(`图片大小不能超过 ${maxSize}MB!`);
            return false;
        }
        return true;
    };

    const handleUpload: UploadProps['customRequest'] = async (options) => {
        const { file, onSuccess, onError } = options;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', file as File);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('上传失败');
            }

            const result = await response.json();
            const url = result.data.fullUrl;
            setFullUrl(result.data.url);
            setImageUrl(url);
            onChange?.(url);
            onSuccess?.(result);
            message.success('图片上传成功!');
        } catch (error) {
            console.error('Upload error:', error);
            message.error('图片上传失败!');
            onError?.(error as Error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!imageUrl) return;

        try {
            const response = await fetch(`/api/upload/delete`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ url: fullUrl })
            });

            if (response.ok) {
                setImageUrl(undefined);
                onChange?.(undefined);
                message.success('图片删除成功!');
            } else {
                message.error('图片删除失败!');
            }
        } catch (error) {
            console.error('Delete error:', error);
            message.error('图片删除失败!');
        }
    };

    return (
        <div>
            {imageUrl ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Image
                        src={imageUrl}
                        alt="上传的图片"
                        style={{
                            width: 120,
                            height: 120,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '1px solid #d9d9d9'
                        }}
                        preview={{
                            mask: (
                                <div style={{ color: 'white', fontSize: 12 }}>
                                    预览
                                </div>
                            )
                        }}
                    />
                    <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor: '#ff4d4f',
                            color: 'white',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </div>
            ) : (
                <Upload
                    accept={accept}
                    beforeUpload={beforeUpload}
                    customRequest={handleUpload}
                    showUploadList={false}
                >
                    <Button
                        icon={<UploadOutlined />}
                        loading={loading}
                        style={{
                            width: 120,
                            height: 120,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px dashed #d9d9d9',
                            borderRadius: 8
                        }}
                    >
                        <div style={{ marginTop: 8, fontSize: 12 }}>
                            {placeholder}
                        </div>
                    </Button>
                </Upload>
            )}
        </div>
    );
};

export default ImageUpload;