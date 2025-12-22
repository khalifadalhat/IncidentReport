export const canSeeNotifications = (role?: string) => {
    return role === 'agent' || role === 'customer';
  };
  