import { useAuthStore } from "@/store/useAuthStore";
import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      const role = useAuthStore.getState().user?.role;
      if (role === "customer") navigate("/customer");
      else if (role === "agent") navigate("/agent");
      else if (role === "admin") navigate("/admin");
    },
  });
};
