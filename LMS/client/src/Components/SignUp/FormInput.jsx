import React from "react";

export default function FormInput({ label, name, type, value, placeholder, onChange, required = false }) {
  return (
    <div>
      <label className="text-gray-950 font-medium text-xl my-2">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2 mb-4 border rounded"
        required={required}
      />
    </div>
  );
}