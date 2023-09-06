import { createRequire } from "node:module"
const require = createRequire(import.meta.url);

const importJSON = (ruta) => require(ruta)

export default importJSON