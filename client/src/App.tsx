import { Route, Routes } from 'solid-app-router';
import { Component, lazy } from 'solid-js';

const Home = lazy(() => import("./pages/Home"));

const App: Component = () => {
  return (
    <>
      <h1 class="bg-red-500 text-white">Terra Noun App</h1>
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
