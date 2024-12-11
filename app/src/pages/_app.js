import "@/styles/globals.css";
import Alert from "@/components/Global/Alert";
import { observer } from "mobx-react";
import { useStore } from '../store/use-store'

function App({ Component, pageProps }) {
  const store = useStore()
  return <>
    <Component {...pageProps} store={store} />
    <Alert />
  </>
}

export default observer(App);