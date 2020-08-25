let jColor = {
  btn: "#e0787f",
  color: "#e0787f",
  bg: "#fdfaf5",
  border: "#bbb",
  currentColor: ""
};

export default function(app, inject) {
  //   if (nuxtState.layout != "admin") {{ $axios, nuxtState, $request }
  let jCssText = `
        --bg: ${jColor.bg};
        --btn: ${jColor.btn};
        --color: ${jColor.color};
        --border: ${jColor.border};
    `;
  document.documentElement.style = jCssText;
  //   }
}
