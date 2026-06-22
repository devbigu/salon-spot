import Router from "./route/Index";
import { AuthProvider } from "./auth/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
};
export default App;
