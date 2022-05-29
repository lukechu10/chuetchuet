import { Component, ParentComponent, ParentProps } from "solid-js";

export const AuthPage: ParentComponent = (props) => {
  // TODO: check if not logged in and redirect to start experience page.
  return props.children;
};
