"use client";

import { store } from "@/app/lib/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <>  
      <ToastContainer/>
      <Provider store={store}>
        {children}
      </Provider>
    </>
  );
}