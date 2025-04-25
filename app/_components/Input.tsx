"use client";

interface InputProps {
    id?: string;
    type?: string;
    name?: string;
    value?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | (() => void);
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | (() => void);
}

const Input = ({ id, type, name, value, placeholder, className, disabled = false, readOnly = false, onChange }: InputProps) => {
    return (
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly} 
            className={`h-[40px] text-base py-0 px-[10px] border rounded-md border-gray-300 outline-none ${className || ''}`.trim()}
            onChange={onChange}
        />
    )
}

export default Input