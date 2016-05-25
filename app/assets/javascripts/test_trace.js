function show_test_trace() {
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "/api/source_images/48/trace_file", true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (oEvent) {
    console.log("received trace response");
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      console.log(byteArray.byteLength);
      var deflated = pako.inflateRaw(byteArray);
      console.log("deflated size: " + deflated.length);

      var string = Utf8ArrayToStr(deflated);
      console.log(string.length);

      var parsed = JSON.parse(string);
      console.log(parsed);

      console.log(parsed.regions[20003289])
    }
  };

  oReq.send(null);
}

function show_image() {

}

// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt

/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
function Utf8ArrayToStr(array, out_buf) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while(i < len) {
    c = array[i++];
    switch(c >> 4)
    {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(((c & 0x0F) << 12) |
                       ((char2 & 0x3F) << 6) |
                       ((char3 & 0x3F) << 0));
        break;
    }
    }

    return out;
}
