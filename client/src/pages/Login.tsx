import { useNavigate } from "solid-app-router";
import { Component } from "solid-js";

const Login: Component = () => {
  const navigate = useNavigate();
  const onClick = () => {
    navigate("/");
  };

  return (
    <div class="container mx-auto">
      <h1 class="pt-10 pb-5 text-xl text-center">Login</h1>
      <form class="flex flex-col items-center space-y-4 max-w-lg px-4 mx-auto">
        <label class="w-full">
          Email
          <input class="block w-full rounded" type="email" required />
        </label>
        <label class="w-full">
          Password
          <input class="block w-full rounded" type="text" required />
        </label>

        <button
          type="button"
          class="block w-full h-10 rounded text-white bg-blue-600"
          onClick={onClick}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default Login;
