import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";

const VILLAGE_PUBLIC_KEY = process.env.NEXT_PUBLIC_VILLAGE_PUBLIC_KEY;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script id="village-script" strategy="beforeInteractive">
        {`
          (function(){var w=window;var d=document;var v=w.Village||{};d.head.appendChild(Object.assign(d.createElement("style"),{textContent:'[village-paths-availability="found"],[village-paths-availability="not-found"]{display:none}'}));v.q=v.q||[];v._call=function(method,args){v.q.push([method,args])};v.init=function(){v._call("init",arguments)};v.identify=function(){v._call("authorize",arguments)};w.Village=v;var l=function(){var s=d.createElement("script");s.type="text/javascript";s.async=true;s.src="https://js.village.do";var x=d.getElementsByTagName("script")[0];x.parentNode.insertBefore(s,x)};if(w.Village.loaded)return;if(w.attachEvent){w.attachEvent("onload",l)}else{w.addEventListener("load",l,false)}w.Village.loaded=true})();
          Village.init('${VILLAGE_PUBLIC_KEY}');
        `}
      </Script>
      <Component {...pageProps} />
    </>
  );
}
