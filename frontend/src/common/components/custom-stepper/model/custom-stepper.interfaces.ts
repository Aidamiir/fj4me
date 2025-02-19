import { type ElementType } from 'react';
import { type StepIconProps } from '@mui/material/StepIcon';

export interface StepDefinition {
    label: string;
    Icon: ElementType;
}

export interface CustomStepperProps {
    activeStep: number;
    steps: StepDefinition[];
}

export interface CustomStepIconProps extends StepIconProps {
    steps: StepDefinition[];
}