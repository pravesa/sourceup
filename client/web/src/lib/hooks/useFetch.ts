import {useState} from 'react';

type FetchProps = RequestInit & {
  url: RequestInfo | URL;
};

/**
 * Custom fetch hook with request status.
 * @returns array of http fetch api and request status.
 */
const useFetch = (): [(reqObj: FetchProps) => Promise<Response>, boolean] => {
  const [fetchStatus, setFetchStatus] = useState(false);

  const handleFetch = (reqObj: FetchProps) => {
    setFetchStatus(true);

    const {url, ...init} = reqObj;
    return fetch(url, init).finally(() => setFetchStatus(false));
  };

  return [handleFetch, fetchStatus];
};

export default useFetch;
