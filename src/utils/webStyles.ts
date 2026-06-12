import { Platform } from 'react-native';

// Inyecta CSS global en web para suprimir estilos del navegador
// que sobreescriben nuestra UI — específicamente el autofill.
// Solo se ejecuta en web, en native no hace nada.
export const injectWebGlobalStyles = () => {
  if (Platform.OS !== 'web') return;

  const style = document.createElement('style');
  style.textContent = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 100px rgba(20, 12, 12, 0.05) inset !important;
      -webkit-text-fill-color: #ECEDEE !important;
      caret-color: #ECEDEE;
      transition: background-color 9999s ease-in-out 0s;
    }
  `;
  document.head.appendChild(style);
};  