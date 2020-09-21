export default function({ app, req, store, error, redirect, route }) {
  if (store && store.state.authUser) {
    return redirect("/");
  }
}
