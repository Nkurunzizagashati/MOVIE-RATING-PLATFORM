const FormInput = ({ label, name, placeholder, ...rest }) => {
  return (
    <div className=" flex flex-col-reverse space-y-6">
      <input
        id={name}
        placeholder={placeholder}
        className=" bg-transparent border-2 rounded border-dark-subtle focus:border-white text-lg w-full text-white p-1 outline-none peer"
        {...rest}
      />
      <label
        htmlFor={name}
        className=" font-semibold text-dark-subtle peer-focus:text-white self-start"
      >
        {label}
      </label>
    </div>
  );
};

export default FormInput;
