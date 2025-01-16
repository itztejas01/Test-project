import React from "react";

const Loader = ({ className = "text-success" }: { className?: string }) => {
  return (
    <div className={`spinner-border ${className}`} role="status">
      <span className="sr-only"></span>
    </div>
  );
};

export { Loader };
