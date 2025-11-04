import React, { useEffect, useRef, useState } from 'react';

interface ZoomEmbedProps {
  meetingNumber: string;
  userName: string;
  signature: string;
  sdkKey: string;
  passcode?: string;
  role: 0 | 1;
}

declare global {
  interface Window { ZoomMtg?: any }
}

export const ZoomEmbed: React.FC<ZoomEmbedProps> = ({ meetingNumber, userName, signature, sdkKey, passcode, role }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const addScript = (src: string) => new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.body.appendChild(s);
    });
    const addCss = (href: string) => {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      document.head.appendChild(l);
    };
    (async () => {
      try {
        addCss('https://source.zoom.us/2.18.0/css/bootstrap.css');
        addCss('https://source.zoom.us/2.18.0/css/react-select.css');
        await addScript('https://source.zoom.us/2.18.0/lib/vendor/react.min.js');
        await addScript('https://source.zoom.us/2.18.0/lib/vendor/react-dom.min.js');
        await addScript('https://source.zoom.us/2.18.0/lib/vendor/redux.min.js');
        await addScript('https://source.zoom.us/2.18.0/lib/vendor/redux-thunk.min.js');
        await addScript('https://source.zoom.us/2.18.0/lib/vendor/lodash.min.js');
        await addScript('https://source.zoom.us/zoom-meeting-2.18.0.min.js');
        setLoaded(true);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded || !window.ZoomMtg) return;
    const zm = window.ZoomMtg;
    zm.setZoomJSLib('https://source.zoom.us/2.18.0/lib', '/av');
    zm.preLoadWasm();
    zm.prepareJssdk();
    const leaveUrl = window.location.href;
    zm.init({
      leaveUrl,
      disableCORP: true,
      success: () => {
        zm.join({
          signature,
          meetingNumber,
          sdkKey,
          userName,
          passWord: passcode || '',
          tk: '',
          success: () => {},
          error: (err: any) => console.error('Zoom join error', err),
        });
      },
      error: (err: any) => console.error('Zoom init error', err),
    });
  }, [loaded, meetingNumber, userName, signature, sdkKey, passcode, role]);

  return <div ref={containerRef} id="zmmtg-root" />;
};


