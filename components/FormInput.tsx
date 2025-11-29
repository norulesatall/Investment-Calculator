
import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
        {label}
      </label>
      <input
        id={id}
        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none transition"
        {...props}
      />
    </div>
  );
};
