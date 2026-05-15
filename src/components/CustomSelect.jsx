// components/CustomSelect.jsx
import Select from 'react-select';

const estilosBase = {
  control: (base) => ({
    ...base,
    height: '40px',
    width: '400px',
    borderRadius: '10px',
    border: '3px solid #0094A4',
    boxShadow: 'none',
    outline: 'none',
    padding: '0 10px',
    fontSize: '1.15rem',
    color: '#212427',
    backgroundColor: '#F8F8F8',
    marginBottom: '10px',
    fontFamily: 'inherit',
    '&:hover': {
      border: '3px solid #0094A4',
    },
  }),

  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    zIndex: 999,
    fontFamily: 'inherit',
    marginTop: '2px',
  }),

  menuList: (base) => ({
    ...base,
    maxHeight: '220px',
    overflowY: 'auto',
    padding: 0,
    borderRadius: '8px',

    '::-webkit-scrollbar': {
      width: '6px',
    },

    '::-webkit-scrollbar-track': {
      background: '#f0f0f0',
      borderRadius: '8px',
    },

    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#aeababbf',
      borderRadius: '8px',
    },
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f5f5f5' : 'white',
    color: '#212427',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '1.15rem',
  }),

  singleValue: (base) => ({
    ...base,
    fontFamily: 'inherit',
    fontSize: '1.15rem',
    color: '#212427',
  }),

  placeholder: (base) => ({
    ...base,
    fontFamily: 'inherit',
    fontSize: '1.15rem',
    color: '#aaa',
  }),

  indicatorSeparator: () => ({ display: 'none' }),
};

export default function CustomSelect({
  onChange,
  value,
  options = [],
  placeholder = "Seleccionar...",
  ...props
}) {

  const valorActual =
    options.find(
      (o) => String(o.value) === String(value)
    ) || null;

  return (
    <Select
      options={options}
      styles={estilosBase}
      placeholder={placeholder}
      noOptionsMessage={() => 'Sin resultados'}
      value={valorActual}
      onChange={(opcion) =>
        onChange(opcion ? opcion.value : '')
      }
      className="ied-select"
      classNamePrefix="custom-select"
      {...props}
    />
  );
}