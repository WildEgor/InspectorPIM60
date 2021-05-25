export type TParseResponseCommand = {
  type: string;
  errorCode?: number;
  protocolVersion?: string;
  resultString?: string;
  identifier?: number;
  errorMessage?: string;
  mode?: number;
  values?: string[] | number[];
};

function parseResponseCommand(responseData: string): TParseResponseCommand {
  const begin: number = responseData.indexOf('r');
  const end: number = responseData.length - 1;
  const a: string[] = responseData.substr(begin, end - begin).split(' ');
  const o: TParseResponseCommand = { type: 'rgVER' };

  o.type = a.splice(0, 1).join();

  if (o.type === 'rgVER') {
    o.errorCode = parseInt(a[0], 10);
    const [protocolVersion] = a;
    o.protocolVersion = protocolVersion;
  } else if (o.type === 'rgRES') {
    o.errorCode = parseInt(a[0], 10);
    o.resultString = responseData.slice(begin + 8, end);
  } else {
    // for INT, STR and ACT, the second element is the identifier
    if (o.type === 'rsINT' || o.type === 'rgINT' || o.type === 'raACT' || o.type === 'rgSTR') {
      o.identifier = parseInt(a.splice(0, 1).join(), 10);
    }
    // next element is always the error code
    o.errorCode = parseInt(a.splice(0, 1).join(), 10);
    // the rest is either an error message or valid return data
    if (o.errorCode) {
      o.errorMessage = a.join(' ');
    } else if (o.type === 'rgMOD') {
      o.mode = parseInt(a[0], 10);
    } else if (o.type === 'rgSTR') {
      const str = a.join(' ');
      const newStr = str.replace(/\"/g, '');
      let arr = newStr.split(',');
      arr = arr.map((item) => item.trim());
      o.values = arr;
    } else {
      o.values = [];
      for (let i = 0; i < a.length; i += 1) {
        if (a[i]) o.values[i] = parseInt(a[i], 10);
      }
    }
  }
  console.log('PARSE DATA DONE: ', o);
  return o;
}

// const handlePromise = (promise) => {
//   return promise
//     .then(data => ([data, undefined]))
//     .catch(error => Promise.resolve([undefined, error]));
// }

// const handleRequest = (fn, msg) => async (...args) => await fn(...args).catch(e => Error(`${msg} caused by: ${e}`));


export default parseResponseCommand;