type TParseResponseCommand = {
  type: string;
  errorCode?: number;
  identifier?: number;
  errorMessage?: string;
  data?: string[];
};

/*
  [type] /..../
  rgVER [errorCode] [protocolVersion]
  rgRES [errorCode] [errorMessage/resultString]
  rsMOD [errorCode] [errorMessage]
  rgMOD [errorCode] [mode] [errorMessage]
  rTRIG [errorCode] [errorMessage]
  rsINT [identifier] [errorCode] [errorMessage]
  rgINT [identifier] [errorCode] [ret1][ret2] ...[retN] [errorMessage]
  raACT [identifier] [errorCode] [errorMessage]
  rgSTR [identifier] [errorCode] [errorMessage/nameString]
  rgSTAT [statistics in XML format]
*/

function parseResponseCommand(responseData: string): string[] {
  const begin: number = responseData.indexOf('r'); 
  const end: number = responseData.length - 1;
  const a: string[] = responseData.substr(begin, end - begin).split(' '); // split string to array 
  const o: TParseResponseCommand = { type: '' };

  o.type = a.splice(0, 1).join(); // get Type
  o.data = [];

  if (o.type === 'rgVER') {
    o.errorCode = Number(a[0]);
    o.data.push(a[1]);
  } else if (o.type === 'rgRES') {
    o.errorCode = Number(a[0]);
    o.data.push(responseData.slice(begin + 8, end)); /// FIXME maybe a[1]
  } else {
    // for INT, STR and ACT, the second element is the identifier
    if (o.type === 'rsINT' || o.type === 'rgINT' || o.type === 'raACT' || o.type === 'rgSTR') {
      o.identifier = Number(a.splice(0, 1).join());
    }
    // next element is always the error code
    o.errorCode = Number(a.splice(0, 1).join());
    // the rest is either an error message or valid return data
    if (o.errorCode) {
      o.errorMessage = a.join(' ');
    } else if (o.type === 'rgMOD') {
      o.data.push(a[0]);
    } else if (o.type === 'rgSTR') {
      // FIXME WTF?!
      o.data = {...a.join(' ').replace(/\"/g, '').split(',').map((item) => item.trim())};
    } else {
      for (let i = 0; i < a.length; i += 1) {
        if (a[i]) o.data.push(a[i]);
      }
    }
  }

  console.log('PARSE DATA RESULT: ', o);

  if (o.errorCode === 0) 
    return o.data
  return [];
}

/**
 * Return [err, data]
 * @param promise 
 * @param errorExt 
 * @returns 
 */
function handlePromise<T, U = Error> (
  promise: Promise<T>,
  errorExt?: Record<string, unknown>
): Promise<[U | null, T | undefined]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        Object.assign(err, errorExt);
      }
      return [err, undefined];
    });
}

//const handleRequest = (fn: Function, msg: string) => async (...args) => await fn(...args).catch(e => Error(`${msg} caused by: ${e}`));

export {
  handlePromise,
  parseResponseCommand
};