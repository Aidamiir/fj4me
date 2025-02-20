'use client';

import { type FC } from 'react';
import { type StepIconProps } from '@mui/material/StepIcon';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import type {
    CustomStepIconProps,
    CustomStepperProps
} from '@/components/custom-stepper';


const CustomStepIcon: FC<CustomStepIconProps> = ({ active, completed, icon, steps }) => {
    const index = typeof icon === 'number' ? icon : Number(icon);
    const IconComponent = steps[index - 1]?.Icon;
    const color = active || completed ? 'primary.main' : 'text.disabled';
    return (
        <Box sx={{ transition: 'color 0.3s ease', color }}>
            {IconComponent ? <IconComponent/> : icon}
        </Box>
    );
};

export const CustomStepper: FC<CustomStepperProps> = ({ activeStep, steps }) => {
    return (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 3, mb: 5 }}>
            {steps.map((step) => (
                <Step key={step.label}>
                    <StepLabel
                        StepIconComponent={(props: StepIconProps) => (
                            <CustomStepIcon {...props} steps={steps}/>
                        )}
                    >
                        {step.label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};
