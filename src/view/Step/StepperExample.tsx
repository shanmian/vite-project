import React, { useEffect } from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Stack } from '@mui/material';
import { StepperProvider, useStepperContext, StepConfig } from './StepperContext';

// 通用表单步骤组件
const StepForm: React.FC<{ config: StepConfig; isLastStep?: boolean }> = ({ config, isLastStep }) => {
  const { state, dispatch, handleSubmit } = useStepperContext();
  const { data } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch({ type: 'UPDATE_DATA', payload: { [name]: value } });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
  };

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      console.log('提交成功，表单数据：', data);
    }
  };

  useEffect(() => {
    const isValid = config.validationFields.every(field => data[field]);
    dispatch({ type: 'SET_VALID', payload: !!isValid });
  }, [config.validationFields.map(field => data[field]).join(',')]);

  return (
    <Stack spacing={2}>
      {config.fields.map(field => (
        <TextField
          key={field.name}
          name={field.name}
          label={field.label}
          type={field.type || 'text'}
          value={data[field.name] || ''}
          onChange={handleChange}
          multiline={field.multiline}
          rows={field.rows}
          fullWidth
          required={field.required}
        />
      ))}
      {isLastStep && (
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            color="inherit"
            onClick={handleBack}
            fullWidth
          >
            上一步
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={onSubmit}
            disabled={!state.isValid || state.isCompleted}
            fullWidth
          >
            {state.isCompleted ? '已提交' : '提交表单'}
          </Button>
        </Box>
      )}
    </Stack>
  );
};

// 主组件
// 修改主组件中的 Stepper 部分
const StepperExample: React.FC = () => {
  const { state, dispatch, stepConfigs } = useStepperContext();
  const steps = ['基本信息', '联系方式', '其他信息'];

  const handleNext = () => {
    if (state.isValid) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      dispatch({ type: 'SET_VALID', payload: false });
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_STEP', payload: state.currentStep - 1 });
  };

  const handleStepClick = (step: number) => {
    if (step <= state.currentStep + 1 && step >= 0) {
      dispatch({ type: 'SET_STEP', payload: step });
    }
  };

  const getStepContent = (step: number) => {
    const config = stepConfigs[step];
    return config ? (
      <StepForm 
        config={config} 
        isLastStep={step === steps.length - 1}
      />
    ) : null;
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Stepper activeStep={state.currentStep}>
        {steps.map((label, index) => (
          <Step 
            key={label} 
            onClick={() => handleStepClick(index)}
            sx={{ 
              cursor: index <= state.currentStep + 1 ? 'pointer' : 'not-allowed',
              '& .MuiStepLabel-root': {
                '&:hover': {
                  color: index <= state.currentStep + 1 ? 'primary.main' : 'inherit'
                }
              }
            }}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4, mb: 2 }}>
        {getStepContent(state.currentStep)}
      </Box>
      {state.currentStep !== steps.length - 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            color="inherit"
            disabled={state.currentStep === 0}
            onClick={handleBack}
          >
            上一步
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!state.isValid}
          >
            下一步
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default () => (
  <StepperProvider>
    <StepperExample />
  </StepperProvider>
);