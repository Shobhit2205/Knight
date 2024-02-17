import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { SnackProvider } from "./Context/SnackBar";
import { AuthProvider } from "./Context/auth";
import { ChatProvider } from "./Context/chat";
import { MessagesProvider } from "./Context/messages";
import { FetchChatProvider } from "./Context/fetch";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <AuthProvider>
      <ChatProvider>
        <MessagesProvider>
          <FetchChatProvider>
            <SnackProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SnackProvider>
          </FetchChatProvider>
        </MessagesProvider>
      </ChatProvider>
    </AuthProvider>
);

reportWebVitals();
