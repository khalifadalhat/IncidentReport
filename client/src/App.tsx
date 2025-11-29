import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { queryClient } from "./lib/queryClient";
import { router } from "./routes";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

export default App;
