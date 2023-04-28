import { checkTokenOff } from "./tokenoff";

checkTokenOff()

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");