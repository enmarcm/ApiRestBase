const midCorsCompleto = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
}

const midNotFound = (req, res) => {
    res
    .status(404)
    .set("content-type", "text/plane ; charset=utf-8")
    .end("<h1>404. NO SE Há ENCONTRADO</h1>");
}

export { midCorsCompleto, midNotFound}