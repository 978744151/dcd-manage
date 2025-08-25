import React, { useState, useEffect } from 'react';
import { Select, Space, Row, Col } from 'antd';
import { provinceApi, cityApi, districtApi } from '../services/api';

const { Option } = Select;

interface RegionData {
    _id: string;
    name: string;
}

interface RegionSelectorProps {
    value?: {
        provinceId?: string;
        cityId?: string;
        districtId?: string;
    };
    onChange?: (value: {
        provinceId?: string;
        cityId?: string;
        districtId?: string;
    }) => void;
    placeholder?: {
        province?: string;
        city?: string;
        district?: string;
    };
    allowClear?: boolean;
    size?: 'small' | 'middle' | 'large';
    style?: React.CSSProperties;
    disabled?: boolean;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({
    value = {},
    onChange,
    placeholder = {
        province: '请选择省份',
        city: '请选择城市',
        district: '请选择区县'
    },
    allowClear = true,
    size = 'middle',
    style,
    disabled = false
}) => {
    const [provinces, setProvinces] = useState<RegionData[]>([]);
    const [cities, setCities] = useState<RegionData[]>([]);
    const [districts, setDistricts] = useState<RegionData[]>([]);
    const [loading, setLoading] = useState({
        province: false,
        city: false,
        district: false
    });

    useEffect(() => {
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (value.provinceId) {
            fetchCities(value.provinceId);
        } else {
            setCities([]);
            setDistricts([]);
        }
    }, [value.provinceId]);

    useEffect(() => {
        if (value.cityId) {
            fetchDistricts(value.cityId);
        } else {
            setDistricts([]);
        }
    }, [value.cityId]);

    const fetchProvinces = async () => {
        try {
            setLoading(prev => ({ ...prev, province: true }));
            const response = await provinceApi.getProvinces();
            setProvinces(response.data.data.provinces);
        } catch (error) {
            console.error('获取省份列表失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, province: false }));
        }
    };

    const fetchCities = async (provinceId: string) => {
        try {
            setLoading(prev => ({ ...prev, city: true }));
            const response = await cityApi.getCities({ provinceId });
            setCities(response.data.data.cities);
        } catch (error) {
            console.error('获取城市列表失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, city: false }));
        }
    };

    const fetchDistricts = async (cityId: string) => {
        try {
            setLoading(prev => ({ ...prev, district: true }));
            const response = await districtApi.getDistricts({ cityId });
            setDistricts(response.data.data.districts);
        } catch (error) {
            console.error('获取区县列表失败:', error);
        } finally {
            setLoading(prev => ({ ...prev, district: false }));
        }
    };

    const handleProvinceChange = (provinceId: string) => {
        const newValue = {
            provinceId,
            cityId: undefined,
            districtId: undefined
        };
        onChange?.(newValue);
    };

    const handleCityChange = (cityId: string) => {
        const newValue = {
            ...value,
            cityId,
            districtId: undefined
        };
        onChange?.(newValue);
    };

    const handleDistrictChange = (districtId: string) => {
        const newValue = {
            ...value,
            districtId
        };
        onChange?.(newValue);
    };

    return (
        <Row gutter={8} style={style}>
            <Col span={8}>
                <Select
                    placeholder={placeholder.province}
                    value={value.provinceId}
                    onChange={handleProvinceChange}
                    allowClear={allowClear}
                    size={size}
                    disabled={disabled}
                    loading={loading.province}
                    style={{ width: '100%' }}
                >
                    {provinces.map(province => (
                        <Option key={province._id} value={province._id}>
                            {province.name}
                        </Option>
                    ))}
                </Select>
            </Col>
            <Col span={8}>
                <Select
                    placeholder={placeholder.city}
                    value={value.cityId}
                    onChange={handleCityChange}
                    allowClear={allowClear}
                    size={size}
                    disabled={disabled || !value.provinceId}
                    loading={loading.city}
                    style={{ width: '100%' }}
                >
                    {cities.map(city => (
                        <Option key={city._id} value={city._id}>
                            {city.name}
                        </Option>
                    ))}
                </Select>
            </Col>
            <Col span={8}>
                <Select
                    placeholder={placeholder.district}
                    value={value.districtId}
                    onChange={handleDistrictChange}
                    allowClear={allowClear}
                    size={size}
                    disabled={disabled || !value.cityId}
                    loading={loading.district}
                    style={{ width: '100%' }}
                >
                    {districts.map(district => (
                        <Option key={district._id} value={district._id}>
                            {district.name}
                        </Option>
                    ))}
                </Select>
            </Col>
        </Row>
    );
};

export default RegionSelector;