import { AnimatePresence } from "framer-motion";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { router } from "./router";

export function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <RouterProvider router={router} />
      </AnimatePresence>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            color: "#fff",
            border: "1px solid rgba(148, 163, 184, 0.25)"
          }
        }}
      />
    </>
  );
}
