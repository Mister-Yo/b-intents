import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router";

import Layout from "@/components/layout";
import { initSDK } from "@/config/defuse-sdk";
import { hotConnector } from "@/config/hot-connector";
import queryClient from "@/config/queryClient";
import Pages from "@/pages";
import { HotConnectorProvider } from "@/providers/hot-connector-provider";
import ThemeProvider from "@/providers/theme-provider";
import { Toaster } from "@/shadcn/ui/sonner";

const Providers = () => {
  useEffect(() => {
    initSDK();
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <HotConnectorProvider connector={hotConnector}>
              <Layout>
                <Pages />
              </Layout>
            </HotConnectorProvider>
          </QueryClientProvider>
          <Toaster />
        </ThemeProvider>
      </Router>
    </HelmetProvider>
  );
};

export default Providers;
