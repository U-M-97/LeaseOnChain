import '../styles/globals.css'
import { Provider } from 'react-redux'
import {store, persistor} from '../redux/store';
import { PersistGate } from "redux-persist/integration/react"
import Layout from '../components/layout'
import "../style.css"
import { ConfigProvider } from "antd"

export default function App({ Component, pageProps }) {
  return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#05F2DB',
              fontFamily: "Inter",
              borderRadius: "10px",
              colorBgBase: "#011526",
              colorText: "#05F2DB",
              colorBorder: "#05F2DB",
              controlOutline: "none",
              colorTextPlaceholder: "#05F2DB",
              colorTextBase: "#05F2DB",
              motionDurationFast: "0.1s",
              colorErrorBg: "#05F2DB",
              colorErrorBorder: "#05F2DB",              
              colorBgTextHover: "#026873",
            },
          }}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ConfigProvider>
      </PersistGate>
    </Provider>
  ) 
}
