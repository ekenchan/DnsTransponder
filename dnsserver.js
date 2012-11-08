var dgram = require('dgram');
var net = require('net');
var config = require('./configuration');
var logger = require('./logger');

var dnsServer = dgram.createSocket('udp4');
dnsServer.on("message", function (udpQuery, rinfo) {
  if (config.debug)
    logger.info('Got query from ' + rinfo.address + ':' + rinfo.port);
  
  // ===================== deliver dns over tcp ===========================
  var tcpClient = new net.Socket({type: 'tcp4'});
  
  tcpClient.on('data', function (tcpResp) {
    var udpResp = tcp2udp(tcpResp);
    dnsServer.send(udpResp, 0, udpResp.length, rinfo.port, rinfo.address);
  });
  
  tcpClient.on('error', function (err) {
    logger.error(err);
  });
  
  tcpClient.connect(config.remotePort, config.remoteAddr, function() {
    tcpClient.write(udp2tcp(udpQuery), function() {
	  if (config.debug)
	    logger.info('Query has been delivered over TCP');
	  
	  tcpClient.end();
	});
  });

  // ===================== deliver dns over tcp ===========================
});

dnsServer.on("listening", function () {
  var address = dnsServer.address();
  logger.info('DNS Server listening on ' +
      address.address + ":" + address.port);
});

dnsServer.bind(config.localPort, config.bindAddr);

function udp2tcp(buffer) {
  var len = buffer.length;
  var newBuf = new Buffer(len + 2);
  newBuf[0] = len >> 8 & 0xFF;
  newBuf[1] = len & 0xFF;
  buffer.copy(newBuf, 2);
  return newBuf;
}

function tcp2udp(buffer) {
  var len = buffer.length;
  if (len > 2) {
    var newBuf = new Buffer(len - 2);
	buffer.copy(newBuf, 0, 2);
	return newBuf;
  } 
  
  return new Buffer(0);
}