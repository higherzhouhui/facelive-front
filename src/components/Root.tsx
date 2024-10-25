import { SDKProvider, useLaunchParams } from '@telegram-apps/sdk-react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { type FC, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { App } from '@/components/App';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { ConfigProvider } from 'antd-mobile';
import enUS from 'antd-mobile/es/locales/en-US'
import { HashRouter } from 'react-router-dom';
import Loading from './Loading';

const ErrorBoundaryError: FC<{ error: unknown }> = ({ error }) => (
  import.meta.env.DEV ?<div style={{ color: '#fff' }}>
    <p>An unhandled error occurred:</p>
    <blockquote>
      <code>
        {error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : JSON.stringify(error)}
      </code>
    </blockquote>
  </div> : <ErrorBoundaryProd /> 
);

function ErrorBoundaryProd() {
  useEffect(() => {
    setTimeout(() => {
      localStorage.clear()
      window.location.reload()
    }, 5000);
  }, [])
  return <div className='error-page'>
    <Loading />
  </div>
}

const Inner: FC = () => {
  const manifestUrl = useMemo(() => {
    return new URL('tonconnect-manifest.json', window.location.href).toString();
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <TonConnectUIProvider manifestUrl={manifestUrl}>
        <SDKProvider acceptCustomStyles>
          <Provider store={store}>
            <ConfigProvider locale={enUS}>
              <HashRouter>
                <App />
              </HashRouter>
            </ConfigProvider>
          </Provider>
        </SDKProvider>
      </TonConnectUIProvider >
    </Suspense>
  );
};

export const Root: FC = () => (
  <ErrorBoundary fallback={ErrorBoundaryError}>
    <Inner />
  </ErrorBoundary>
);
