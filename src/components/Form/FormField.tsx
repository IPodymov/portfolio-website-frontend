import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'url' | 'textarea' | 'select';
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  options,
  error,
}) => {
  const renderInput = () => {
    const commonProps = {
      id: name,
      name,
      value,
      onChange,
      placeholder,
      required,
      disabled,
      className: `form-control ${error ? 'form-control--error' : ''}`,
    };

    if (type === 'textarea') {
      return <textarea {...commonProps} rows={rows} />;
    }

    if (type === 'select' && options) {
      return (
        <select {...commonProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return <input {...commonProps} type={type} />;
  };

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      {renderInput()}
      {error && <span className="form-field-error">{error}</span>}
    </div>
  );
};

export default FormField;
