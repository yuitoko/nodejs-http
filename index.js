'use strict';
const http = require('node:http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    console.info(`Requested by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });
    
    switch (req.method) {
      case 'GET':
        if (req.url === '/') {
          res.write(pug.renderFile('./top.pug'));
        } else if (req.url === '/enquetes') {
          res.write(pug.renderFile('./enquetes.pug'));
        } else if (req.url === '/enquetes/yaki-tofu') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '焼肉',
              secondItem: '湯豆腐'
            })
          );
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: 'ごはん',
              secondItem: 'パン'
            })
          );
        } else if (req.url === '/enquetes/sushi-pizza') {
          res.write(
            pug.renderFile('./form.pug', {
              path: req.url,
              firstItem: '寿司',
              secondItem: 'ピザ'
            })
          );
        }
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData += chunk;
          })
          .on('end', () => {
            const answer = new URLSearchParams(rawData);
            const body = `${answer.get('name')}さんは${answer.get('favorite')}に投票しました`;
            console.info(body);
            res.write(
              `<!DOCTYPE html><html lang="ja"><body><h1>${body}</h1></body></html>`
            );
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error(`Server Error`, e);
  })
  .on('clientError', e => {
    console.error(`Client Error`, e);
  });
const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on ${port}`);
});