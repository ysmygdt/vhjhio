export const FileInput = ({ type, onChange }) => {
    return (
      <input type={type} onChange={onChange} />
    );
  };
  
  export const SendButton = ({ onClick, children }) => {
    return (
      <button onClick={onClick}>{children}</button>
    );
  };
  
  // Export the 'Input' component
  export const Input = ({ type, placeholder, value, onChange }) => {
    return (
      <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
    );
  };
  