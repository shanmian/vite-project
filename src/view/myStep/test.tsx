import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  Box,
  Typography
} from '@mui/material';

interface FormData {
  step1: {
    field1: string;
    field2: string;
  };
  step2: {
    field1: string;
    field2: string;
  };
  step3: {
    field1: string;
    field2: string;
  };
}

const MultiStepForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    step1: { field1: '', field2: '' },
    step2: { field1: '', field2: '' },
    step3: { field1: '', field2: '' }
  });

  const steps = ['Step 1', 'Step 2', 'Step 3'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (step: keyof FormData, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [step]: {
        ...prev[step as keyof FormData],
        [field]: value
      }
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    // 在这里处理表单提交逻辑
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Field 1"
              margin="normal"
              value={formData.step1.field1}
              onChange={(e) => handleInputChange('step1', 'field1', e.target.value)}
            />
            <TextField
              fullWidth
              label="Field 2"
              margin="normal"
              value={formData.step1.field2}
              onChange={(e) => handleInputChange('step1', 'field2', e.target.value)}
            />
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Field 1"
              margin="normal"
              value={formData.step2.field1}
              onChange={(e) => handleInputChange('step2', 'field1', e.target.value)}
            />
            <TextField
              fullWidth
              label="Field 2"
              margin="normal"
              value={formData.step2.field2}
              onChange={(e) => handleInputChange('step2', 'field2', e.target.value)}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              label="Field 1"
              margin="normal"
              value={formData.step3.field1}
              onChange={(e) => handleInputChange('step3', 'field1', e.target.value)}
            />
            <TextField
              fullWidth
              label="Field 2"
              margin="normal"
              value={formData.step3.field2}
              onChange={(e) => handleInputChange('step3', 'field2', e.target.value)}
            />
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length ? (
        <Box sx={{ p: 2 }}>
          <Typography>All steps completed!</Typography>
        </Box>
      ) : (
        <>
          {getStepContent(activeStep)}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
            >
              {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default MultiStepForm;