import { useState } from 'react';
import DynamicForm from '../../components/DynamicForm';

// 模拟异步接口
const fetchSalaryByDepartment = async (department: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      const salaryMap = {
        'dev': '15000',
        'hr': '10000'
      };
      resolve(salaryMap[department as keyof typeof salaryMap] || '');
    }, 500);
  });
};

const FormDemo = () => {
  const formFields = [
    // 同步示例：姓名联动
    {
      id: 'name',
      type: 'text' as const,
      label: '姓名',
      placeholder: '请输入姓名',
      validation: {
        required: true,
        minLength: 2,
        message: '请输入至少2个字符的姓名'
      },
      onChange: (value: string, allValues: Record<string, string>) => {
        // 同步方式：直接返回需要更新的值
        return {
          name: value,
          email: value ? `${value.toLowerCase().replace(/\s/g, '')}@company.com` : '',
          nickname: value ? `${value}_nick` : ''
        };
      }
    },
    {
      id: 'email',
      type: 'text' as const,
      label: '邮箱',
      disabled: true,
      validation: {
        required: true,
        pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        message: '请输入有效的邮箱地址'
      }
    },
    {
      id: 'nickname',
      type: 'text' as const,
      label: '昵称',
      disabled: true
    },
    {
      id: 'department',
      type: 'select' as const,
      label: '部门',
      options: [
        { value: '', label: '请选择部门' },
        { value: 'dev', label: '研发部' },
        { value: 'hr', label: '人力资源' }
      ],
      validation: {
        required: true,
        message: '请选择部门'
      },
      onChange: async (value: string, allValues: Record<string, string>, setValues: (values: Record<string, string>) => void) => {
        if (value) {
          try {
            // 异步调用获取薪资
            const salary = await fetchSalaryByDepartment(value);
            // 使用 setValues 更新多个字段
            setValues({
              ...allValues,
              department: value,
              position: '',
              workAddress: '',
              salary
            });
          } catch (error) {
            console.error('获取薪资失败:', error);
            // 发生错误时的处理
            setValues({
              ...allValues,
              department: value,
              position: '',
              workAddress: '',
              salary: ''
            });
          }
        } else {
          // 清空选择时的处理
          setValues({
            ...allValues,
            department: '',
            position: '',
            workAddress: '',
            salary: ''
          });
        }
      }
    },
    {
      id: 'position',
      type: 'select' as const,
      label: '职位',
      options: [],
      validation: {
        required: true,
        message: '请选择职位'
      },
      dependencies: {
        fields: ['department'],
        effect: (values: Record<string, string>) => {
          type DepartmentType = 'dev' | 'hr';
          type PositionMapType = {
            [K in DepartmentType]: Array<{ value: string; label: string }>;
          };

          const positionMap: PositionMapType = {
            'dev': [
              { value: 'frontend', label: '前端开发' },
              { value: 'backend', label: '后端开发' }
            ],
            'hr': [
              { value: 'recruiter', label: '招聘专员' },
              { value: 'trainer', label: '培训专员' }
            ]
          };

          return {
            value: '',
            options: values.department && (values.department in positionMap) ? 
              [{ value: '', label: '请选择职位' }, ...positionMap[values.department as DepartmentType]] : 
              [{ value: '', label: '请选择职位' }],
            disabled: !values.department
          };
        }
      }
    },
    {
      id: 'salary',
      type: 'text' as const,
      label: '薪资',
      disabled: true
    },
    {
      id: 'workAddress',
      type: 'text' as const,
      label: '工作地点',
      placeholder: '请输入工作地点',
      dependencies: {
        fields: ['department', 'position'],
        effect: (values: Record<string, string>) => ({
          disabled: !values.department || !values.position,
          value: values.department && values.position ? '' : ''
        })
      }
    }
  ];

  const handleSubmit = (formData: Record<string, string>) => {
    console.log('表单提交数据:', formData);
  };

  return (
    <DynamicForm 
      title="员工信息表单"
      fields={formFields} 
      submitText="提交"
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        email: '',
        nickname: '',
        department: '',
        position: '',
        salary: '',
        workAddress: ''
      }}
    />
  );
};

export default FormDemo;