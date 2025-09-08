import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import App from "next/app";

const VILLAGE_PUBLIC_KEY = process.env.NEXT_PUBLIC_VILLAGE_PUBLIC_KEY;
const VILLAGE_SCRIPT_URL = process.env.NEXT_PUBLIC_VILLAGE_SCRIPT_URL;

interface CustomAppProps extends AppProps {
  publicKey: string;
}

function MyApp({ Component, pageProps, publicKey }: CustomAppProps) {
  return (
    <>
      <Script id="village-script" strategy="beforeInteractive">
        {`
          (function(){var w=window;var d=document;var v=w.Village||{};d.head.appendChild(Object.assign(d.createElement("style"),{textContent:'[village-paths-availability="found"],[village-paths-availability="not-found"]{display:none}'}));v.q=v.q||[];v._call=function(method,args){v.q.push([method,args])};v.init=function(){v._call("init",arguments)};v.identify=function(){v._call("authorize",arguments)};w.Village=v;var l=function(){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="${VILLAGE_SCRIPT_URL}";var x=d.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x)};if(w.Village.loaded)return;if(w.attachEvent){w.attachEvent("onload",l)}else{w.addEventListener("load",l,false)}w.Village.loaded=true})();
          Village.init('${publicKey}');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  // Call the default App.getInitialProps
  const appProps = await App.getInitialProps(appContext);

  // Get the current path from the router
  const { asPath } = appContext.router;

  // Check if the current path contains the word "public"
  const isPublicPath = asPath.includes("public");
  const publicKey = isPublicPath ? "pk_landing_public" : VILLAGE_PUBLIC_KEY;

  return {
    ...appProps,
    publicKey,
  };
};

export default MyApp;
