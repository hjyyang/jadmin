export default function({ store, error, redirect, route }) {
  if (!store || !store.state.authUser) {
    return redirect("/login");
  }
}
