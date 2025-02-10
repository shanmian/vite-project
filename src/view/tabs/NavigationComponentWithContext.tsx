import React, { createContext, useContext, useReducer, useCallback, memo, ReactNode } from 'react';
import {
  Box, Tabs, Tab, Stepper, Step, StepLabel,
  Typography, Paper, Button, SxProps, Theme
} from '@mui/material';

// 状态定义
interface NavigationState {
  currentIndex: number;
  type: 'tabs' | 'stepper';
  isValid: boolean;
}

// Action 定义
type NavigationAction =
  | { type: 'SET_INDEX'; payload: number }
  | { type: 'SET_TYPE'; payload: 'tabs' | 'stepper' }
  | { type: 'SET_VALID'; payload: boolean };

// 添加 TabPanelProps 接口定义
interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

// Context 定义
interface NavigationContextType {
  state: NavigationState;
  dispatch: React.Dispatch<NavigationAction>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Reducer
const navigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  switch (action.type) {
    case 'SET_INDEX':
      return { ...state, currentIndex: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_VALID':
      return { ...state, isValid: action.payload };
    default:
      return state;
  }
};

// Provider 组件
interface NavigationProviderProps {
  children: ReactNode;
  initialType?: 'tabs' | 'stepper';
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  initialType = 'stepper'
}) => {
  const [state, dispatch] = useReducer(navigationReducer, {
    currentIndex: 0,
    type: initialType,
    isValid: false
  });

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Hook
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

// TabPanel 组件
const TabPanel = memo(({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
));

// Props 定义
interface NavigationComponentProps {
  items: ReactNode[];
  contents: ReactNode[];
  sx?: SxProps<Theme>;
  orientation?: 'horizontal' | 'vertical';
  onFinish?: () => void;
  onCancel?: () => void;
  showNextButton?: boolean;
  showBackButton?: boolean;
  showFinishButton?: boolean;
  showCancelButton?: boolean;
}

// 主组件
const NavigationComponent: React.FC<NavigationComponentProps> = ({
  items,
  contents,
  sx,
  orientation = 'horizontal',
  onFinish,
  onCancel,
  showNextButton = true,
  showBackButton = true,
  showFinishButton = true,
  showCancelButton = true,
}) => {
  const { state, dispatch } = useNavigation();

  const handleChange = useCallback((_: React.SyntheticEvent | null, newValue: number) => {
    dispatch({ type: 'SET_INDEX', payload: newValue });
  }, []);

  const TabsComponent = () => (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={state.currentIndex}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          orientation={orientation}
        >
          {items.map((item, index) => (
            <Tab key={index} label={item} />
          ))}
        </Tabs>
      </Box>
      {contents.map((content, index) => (
        <TabPanel key={index} value={state.currentIndex} index={index}>
          {content}
        </TabPanel>
      ))}
    </>
  );

  const StepperComponent = () => {
    const isFirstStep = state.currentIndex === 0;
    const isLastStep = state.currentIndex === items.length - 1;

    const handleNext = () => handleChange(null, state.currentIndex + 1);
    const handleBack = () => handleChange(null, state.currentIndex - 1);

    return (
      <>
        <Stepper activeStep={state.currentIndex} orientation={orientation} sx={{ p: 3 }}>
          {items.map((label, index) => (
            <Step
              key={index}
              onClick={() => handleChange(null, index)}
              sx={{ cursor: 'pointer' }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ p: 3 }}>
          {contents[state.currentIndex] || <Typography>暂无内容</Typography>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, gap: 1, justifyContent: 'flex-end' }}>
          {showCancelButton && onCancel && (
            <Button color="inherit" onClick={onCancel}>取消</Button>
          )}
          {showBackButton && (
            <Button color="inherit" disabled={isFirstStep} onClick={handleBack}>
              上一步
            </Button>
          )}
          {!isLastStep && showNextButton && (
            <Button onClick={handleNext}>下一步</Button>
          )}
          {isLastStep && showFinishButton && onFinish && (
            <Button
              onClick={onFinish}
              variant="contained"
              color="primary"
              disabled={!state.isValid}
            >
              完成
            </Button>
          )}
        </Box>
      </>
    );
  };

  return (
    <Paper elevation={3} sx={{ width: '100%', ...sx }}>
      {state.type === 'tabs' ? <TabsComponent /> : <StepperComponent />}
    </Paper>
  );
};

export default NavigationComponent;