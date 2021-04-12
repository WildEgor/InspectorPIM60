function parseResponseCommand(payload) {
    console.log('To parse', payload)
  const responseData = payload.toString()
  let begin = responseData.indexOf("r"); // see README.md
  let end   = responseData.length - 1;
  let a = responseData.substr(begin, end - begin).split(" ");
  let o = {};
  // first element is always the type of the message
  o.type = a.splice(0,1);
  if(o.type == "rgVER") {
      o.errorCode = parseInt(a[0], 10);
      o.protocolVersion = a[1];                              
  } else if(o.type == "rgRES") {
      o.errorCode = parseInt(a[0], 10);
      o.resultString = responseData.slice(begin+8,end);
  } else {
      // for INT, STR and ACT, the second element is the identifier
      if(o.type == "rsINT" || o.type == "rgINT" || o.type == "raACT" || o.type == "rgSTR") {
          o.identifier = parseInt(a.splice(0,1));
      }
      // next element is always the error code
      o.errorCode = parseInt(a.splice(0,1));
      // the rest is either an error message or valid return data
      if(o.errorCode) {
          o.errorMessage = a.join(" ");
      } else {
          if(o.type == "rgMOD") {
            o.mode = parseInt(a[0]);
          } else if(o.type == "rgSTR") {
              const str = a.join(' ');
              const newStr = str.replace(/\"/g, "");
              let arr = newStr.split(',');
              arr = arr.map(item => item.trim())
              o.values = arr
          } else {
              o.values = [];
              console.log(a)
              for(var i=0; i<a.length; i++) {
                  if (a[i])
                      o.values[i] = parseInt(a[i]);
              }
          }
      }
  }  
  console.log('PARSE DATA DONE: ', o)
  return o
}

export {
  parseResponseCommand
};
