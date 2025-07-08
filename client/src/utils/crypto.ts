export const safeLocalStorage = {
  setEmail: (email: string) => {
    const encrypted = btoa(encodeURIComponent(email));
    localStorage.setItem('rememberedEmail', encrypted);
  },
  getEmail: () => {
    const encrypted = localStorage.getItem('rememberedEmail');
    return encrypted ? decodeURIComponent(atob(encrypted)) : null;
  },
  clearEmail: () => localStorage.removeItem('rememberedEmail'),
};
