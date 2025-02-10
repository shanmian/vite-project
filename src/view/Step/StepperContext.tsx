import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// 定义共享数据接口
interface StepData {
  name?: string;
  phone?: string;
  address?: string;
  email?: string;
  [key: string]: any;
}

interface StepperState {
  data: StepData;
  currentStep: number;
  isValid: boolean;
  isCompleted: boolean; // 添加完成状态
}

type StepperAction = 
  | { type: 'UPDATE_DATA'; payload: Partial<StepData> }
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_VALID'; payload: boolean }
  | { type: 'COMPLETE_FORM' }; // 添加完成动作

const initialState: StepperState = {
  data: {},
  currentStep: 0,
  isValid: false,
  isCompleted: false
};

const stepperReducer = (state: StepperState, action: StepperAction): StepperState => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload }
      };
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'SET_VALID':
      return {
        ...state,
        isValid: action.payload
      };
    case 'COMPLETE_FORM':
      return {
        ...state,
        isCompleted: true
      };
    default:
      return state;
  }
};

// 添加一个提交表单的辅助函数
export const submitForm = (data: StepData) => {
  console.log('表单数据：', data);
  // 这里可以添加实际的提交逻辑
  return Promise.resolve(data);
};

// 添加步骤配置接口
// 修改 StepConfig 接口，添加可选的 required 字段
export interface StepConfig {
  fields: {
    name: string;
    label: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
    required?: boolean;  // 新增字段，控制是否必填
  }[];
  validationFields: string[];  // 只校验需要验证的字段
}

// 添加步骤配置到 Context
interface StepperContextType {
  state: StepperState;
  dispatch: React.Dispatch<StepperAction>;
  handleSubmit: () => Promise<boolean>;
  stepConfigs: StepConfig[];
}

const StepperContext = createContext<StepperContextType>({
  state: initialState,
  dispatch: () => null,
  handleSubmit: async () => false,
  stepConfigs: []
});

// 修改 Provider 组件
export const StepperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stepperReducer, initialState);

  const handleSubmit = async () => {
    try {
      await submitForm(state.data);
      dispatch({ type: 'COMPLETE_FORM' });
      return true;
    } catch (error) {
      console.error('提交失败：', error);
      return false;
    }
  };

  // 修改 stepConfigs 配置
  const stepConfigs: StepConfig[] = [
    {
      fields: [
        { name: 'name', label: '姓名', required: true },
        { name: 'phone', label: '电话', required: true }
      ],
      validationFields: ['name', 'phone']
    },
    {
      fields: [
        { name: 'email', label: '邮箱', type: 'email', required: false },
        { name: 'address', label: '地址', multiline: true, rows: 3 }  // 非必填
      ],
      validationFields: ['email']  // 只验证邮箱
    },
    {
      fields: [
        { name: 'company', label: '公司名称', required: true },
        { name: 'remark', label: '备注信息', multiline: true, rows: 3 }  // 非必填
      ],
      validationFields: ['company']  // 只验证公司名称
    }
  ];

  return (
    <StepperContext.Provider value={{ state, dispatch, handleSubmit, stepConfigs }}>
      {children}
    </StepperContext.Provider>
  );
};

// 修改 hook
export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext must be used within StepperProvider');
  }
  return context;
};