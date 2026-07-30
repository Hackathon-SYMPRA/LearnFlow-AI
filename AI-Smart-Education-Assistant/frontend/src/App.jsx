import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { AppRouter } from "@/components/router/AppRouter";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SympraVoiceProvider } from "@/contexts/SympraVoiceContext";
import SympraAssistantUI from "@/components/SympraAssistantUI";

export const App = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppProvider>
              <SympraVoiceProvider>
                <SympraAssistantUI />
                <AppRouter />
              </SympraVoiceProvider>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
