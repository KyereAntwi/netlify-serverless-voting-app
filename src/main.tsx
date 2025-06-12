import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router";
import Auth0ProviderWithHistory from "./auth/AuthProviderWithHistory.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {SelectedPollTypeProvider} from "./contexts/SelectedPollTypeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Auth0ProviderWithHistory>
          <QueryClientProvider client={new QueryClient()}>
            <SelectedPollTypeProvider>
              <App />
            </SelectedPollTypeProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Auth0ProviderWithHistory>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
