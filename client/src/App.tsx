import { Route, Routes } from "solid-app-router";
import { Component, lazy } from "solid-js";
import { AuthPage } from "./components/auth";

const Home = lazy(() => import("./pages/Home"));
const StartExperience = lazy(() => import("./pages/StartExperience"));
const Login = lazy(() => import("./pages/Login"));
const Settings = lazy(() => import("./pages/Settings"));

const App: Component = () => {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <AuthPage>
              <Home />
            </AuthPage>
          }
        />
        <Route path="/start" element={<StartExperience />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/settings"
          element={
            <AuthPage>
              <Settings />
            </AuthPage>
          }
        />
      </Routes>
    </>
  );
};

export default App;
