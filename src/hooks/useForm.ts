import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
}

interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  submitError: string;
  submitSuccess: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: T[keyof T]) => void;
  resetForm: () => void;
  setSubmitError: (error: string) => void;
}

export function useForm<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  validate,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error when field changes
    if (errors[name as keyof T]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Validate if validator provided
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
      setSubmitSuccess(true);
    } catch (error: unknown) {
      const err = error as Error;
      setSubmitError(err.message || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit, validate]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitError('');
    setSubmitSuccess(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
    setSubmitError,
  };
}
