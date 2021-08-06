const fs = require("fs");
const http = require('http');
const url = require("url");
const overviewTemplate = fs.readFileSync('./templates/overview.html/', 'utf-8')
const productTemplate = fs.readFileSync('./templates/product.html/', 'utf-8')
const data = fs.readFileSync('./dev-data/data.json/', 'utf-8');
const dataObj = JSON.parse(data);
const productcard = fs.readFileSync('./templates/productcard.html/', 'utf-8');
const viewcard = fs.readFileSync('./templates/viewcard.html', 'utf-8');
const replaceData = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%id%}/g, product.id);
    return output;
}

const server = http.createServer((req, res) => {
    console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true);
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' })

        const cards = dataObj.map((ele) => replaceData(productcard, ele)).join('');
        const output = overviewTemplate.replace('{%PRODUCTS%}', cards)
        res.end(output);
    }
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id];
        const output = replaceData(viewcard, product);
        console.log(output);
        const finalProduct = productTemplate.replace(/{%PRODUCT%}/g, output)
        res.end(finalProduct);
    }
    else {
        res.end("Not found");
    }
});

server.listen('8000', '127.0.0.1', () => {
    console.log("server starting");
})
