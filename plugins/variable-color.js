let jColor = {
  btn: "#e0787f",
  color: "#e0787f",
  bg: "#fdfaf5",
  border: "#bbb",
  currentColor: ""
};
let jCssText = `
  --bg: ${jColor.bg};
  --btn: ${jColor.btn};
  --color: ${jColor.color};
  --border: ${jColor.border};
`;
export default function({ $axios }, inject) {
  inject("jCssText", jCssText);
}
