import React from "react";

export default function Button({ onClick, children, className, type = "button" }) {
  return (
    <button
      type={type}
      className={`btn btn-dark text-xl p-1 hover:bg-green-600 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}