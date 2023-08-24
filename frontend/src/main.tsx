import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AskLogin from "./pages/ask-login";
import LoginToken from "./utils/login-token";
import { ContextMenuProvider } from "./providers/context-menu.provider";
import { NavigationProvider } from "./providers/navigation.provider";
import { PlayerProvider } from "./providers/player.provider";
import { SettingsProvider } from "./providers/settings.provider";
import Compose from "./utils/compose";
import "./index.scss";
import { ErrorProvider } from "./providers/error.provider";
import CustomApolloProvider from "./providers/custom-apollo.provider";

const token = LoginToken.getToken();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      {token ? (
        <Compose
          components={[
            ErrorProvider,
            CustomApolloProvider,
            SettingsProvider,
            NavigationProvider,
            PlayerProvider,
            ContextMenuProvider,
          ]}
        >
          <App />
        </Compose>
      ) : (
        <AskLogin />
      )}
  </React.StrictMode>
);
