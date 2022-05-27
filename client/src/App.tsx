import { Route, Routes } from 'solid-app-router';
import { Component, lazy } from 'solid-js';

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));

const App: Component = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
};

export default App;
