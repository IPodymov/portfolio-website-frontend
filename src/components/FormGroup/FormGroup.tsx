import React from 'react';
import './FormGroup.css';

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return <div className={`form-group ${className}`}>{children}</div>;
};

// Form Row for horizontal layouts
interface FormRowProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

const FormRow: React.FC<FormRowProps> = ({ children, columns = 2, className = '' }) => {
  return <div className={`form-row form-row--${columns} ${className}`}>{children}</div>;
};

// Form Actions for buttons at the end of forms
interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({ children, align = 'right', className = '' }) => {
  return <div className={`form-actions form-actions--${align} ${className}`}>{children}</div>;
};

export { FormGroup, FormRow, FormActions };
export default FormGroup;
