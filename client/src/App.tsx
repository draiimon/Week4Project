import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { Footer } from "@/components/ui/footer";

// Import the new pages
import DynamoDBPage from "@/pages/dynamodb-page";
import RegionsPage from "@/pages/regions-page";
import UserServicesPage from "@/pages/user-services-page";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route>
        <Switch>
          <ProtectedRoute path="/" component={HomePage} />
          <ProtectedRoute path="/dynamodb" component={DynamoDBPage} />
          <ProtectedRoute path="/regions" component={RegionsPage} />
          <ProtectedRoute path="/user-services" component={UserServicesPage} />
          <Route component={NotFound} />
        </Switch>
        {/* Footer only on non-auth pages, but outside main content flow */}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Router />
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
