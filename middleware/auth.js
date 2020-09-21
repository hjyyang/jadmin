export default function({ app, req, store, error, redirect, route }) {
  if (!store || !store.state.authUser) {
    return redirect("/login?redirect=" + route.fullPath);
  } else {
    if (store.state.authUser.u_role == 0) {
      //普通用户无法访问admin页面
      return redirect("/304");
    }
  }
}
