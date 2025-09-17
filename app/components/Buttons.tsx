import React from "react";

interface ButtonsProps {
  onClick: () => void;
  className: string;
  icon?: React.ReactNode;
  imgSrc?: string;
  text?: string;
  num?: number; 
  label?: string;
}

const Buttons: React.FC<ButtonsProps> = ({
  onClick,
  className,
  icon,
  imgSrc,
  text,
  num,
  label
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center justify-center ${className}`}
    >
      {/* Icon */}
      {icon && <span>{icon}</span>}

      {/* Optional Image */}
      {imgSrc && <img src={imgSrc} alt="button-img" className="w-5 h-5" />}

      {/* Optional Text */}
      {text && <span>{text}</span>}

      {/* Shortcut Number in bottom-right corner */}
      {num !== undefined && (
        <span className="absolute bottom-0 right-0 text-[8px] md:text-[9px] 2xl:text-[12px] text-gray-400">
          {num}
        </span>
      )}

      {label && (
        <span className="absolute bottom-full mb-1 hidden group-hover:block text-xs bg-black text-white px-2 py-1 rounded">
        {label}
      </span>
      )}
    </button>
  );
};

export default Buttons;
