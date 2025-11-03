import {StylesConfig} from 'react-select';

//Estilos personalizados
const customStyle: StylesConfig = {
  container: (defaultStyle) => ({
    ...defaultStyle,
    width: "85%",
    fontFamily: "Arial, Helvetica, sans-serif",
    "*": {
      cursor: "pointer",
    },
    "@media (max-width: 900px)": {
      width: "100%",
    },
  }),
  control: (defaultStyle, state) => ({
    ...defaultStyle,
    height: "2.4rem",
    margin: "0",
    padding: "0 0.5rem 0 1rem",
    width: "100%",
    backgroundColor: "var(--neutro)",
    color: "var(--texto)",
    fontSize: "1rem",
    textAlign: "start",
    borderRadius: "0.5rem",
    boxShadow: "none",
    border: state.isFocused ? "0.125rem solid var(--colorPrimario)" : "0.125rem solid transparent",

    transition: "border 0.15s",

    ":hover": {
      border: state.isFocused ? "0.125rem solid var(--colorPrimario)" : "0.125rem solid var(--textoSecundario)",
    },
  }),
  dropdownIndicator: () => ({
    display: "flex",
    alignItems: "center",
    color: "var(--textoSecundario)",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  valueContainer: (defaultStyle) => ({
    ...defaultStyle,
    margin: "0",
    padding: "0",
    width: "0",
  }),
  singleValue: (defaultStyle) => ({
    ...defaultStyle,
    color: "var(--texto)",
    margin: "0",
    padding: "0",
  }),
  input: (defaultStyle) => ({
    ...defaultStyle,
    margin: "0",
    padding: "0",
    // Coloco width 1rem para evitar que crezca el recuadro
    width: "0",
  }),
  menu: () => ({
    color: "var(--texto)",
    position: "absolute",
    width: "100%",
    margin: "0",
    padding: "0",

    top: "3rem",
    left: "0",
    backgroundColor: "var(--blanco)",
    border: "0.125rem solid var(--textoSecundario)",
    borderRadius: "0.5rem",
    zIndex: "1"
  }),
  menuList: () => ({
    maxHeight: "12rem",
    margin: "0 0.3rem 0.3rem",
    overflow: "auto",
    transition: "scrollbar-color 0.3s",

    ":hover": {
      scrollbarColor: "var(--textoSecundario) transparent",
    }
  }),
  option: (defaultStyle, state) => ({
    ...defaultStyle,
    margin: "0",
    marginTop: "0.3rem",
    padding: "0 0.6rem",
    borderRadius: "0.5rem",
    height: "2.4rem",
    display: "flex",
    alignItems: "center",

    cursor: "pointer",
    userSelect: "none",

    //Configuración del texto para cortarlo si es demasiado grande
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",

    ":hover": {
      backgroundColor: "var(--colorPrimario)",
      color: "var(--blanco)",
    },
    ":last-child": {
      marginBottom: "0.3rem",
    },

    backgroundColor: state.isFocused ? 'var(--bordes)' : 'var(--blanco)',
    color: 'var(--texto)',
  }),
}

export default customStyle;