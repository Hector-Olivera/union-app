import { useState } from 'react';

// Tipos de los campos que puede tener el formulario
type FormFields = {
  email: string;
  password: string;
  displayName?: string;
  confirmPassword?: string;
};

// Tipo de errores — mismas keys que los campos
type FormErrors = Partial<Record<keyof FormFields, string>>;

// Validaciones puras — funciones sin side effects
// Fáciles de testear unitariamente
const validators = {
  email: (value: string): string | null => {
    if (!value) return 'El email es requerido';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalido';
    return null;
  },
  password: (value: string): string | null => {
    if (!value) return 'La contraseña es requerida';
    if (value.length < 6) return 'Minimo 6 caracteres';
    return null;
  },
  displayName: (value: string): string | null => {
    if (!value) return 'El nombre es requerido';
    if (value.length < 2) return 'Minimo 2 caracteres';
    if (value.length > 20) return 'Maximo 20 caracteres';
    return null;
  },
  confirmPassword: (value: string, password: string): string | null => {
    if (!value) return 'Confirma tu contraseña';
    if (value !== password) return 'Las contraseñas no coinciden';
    return null;
  },
};

export const useAuthForm = (mode: 'login' | 'register') => {
  const [fields, setFields] = useState<FormFields>({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  // "touched" registra qué campos ya tocó el usuario
  // Solo mostramos error de un campo si el usuario ya lo tocó
  // Evita mostrar "campo requerido" antes de que el usuario haga nada

  const updateField = (key: keyof FormFields, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }));
    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[key]) validateField(key, value);
  };

  const touchField = (key: keyof FormFields) => {
    setTouched(prev => ({ ...prev, [key]: true }));
    validateField(key, fields[key] || '');
  };
  // touchField se llama en onBlur (cuando el usuario sale del input)

  const validateField = (key: keyof FormFields, value: string) => {
    let error: string | null = null;
    if (key === 'email') error = validators.email(value);
    else if (key === 'password') error = validators.password(value);
    else if (key === 'displayName') error = validators.displayName(value);
    else if (key === 'confirmPassword') error = validators.confirmPassword(value, fields.password);

    setErrors(prev => ({ ...prev, [key]: error || undefined }));
    return !error;
  };

  const validateAll = (): boolean => {
    // Validar todos los campos y marcarlos como tocados
    const fieldsToValidate: (keyof FormFields)[] =
      mode === 'login'
        ? ['email', 'password']
        : ['email', 'password', 'displayName', 'confirmPassword'];

    let isValid = true;
    const newErrors: FormErrors = {};
    const newTouched: Partial<Record<keyof FormFields, boolean>> = {};

    fieldsToValidate.forEach(key => {
      newTouched[key] = true;
      let error: string | null = null;
      if (key === 'email') error = validators.email(fields[key] || '');
      else if (key === 'password') error = validators.password(fields[key] || '');
      else if (key === 'displayName') error = validators.displayName(fields[key] || '');
      else if (key === 'confirmPassword') error = validators.confirmPassword(fields[key] || '', fields.password);
      if (error) { newErrors[key] = error; isValid = false; }
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  return { fields, errors, touched, updateField, touchField, validateAll };
};