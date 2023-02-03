import '../styles/globals.css'
import { Provider } from 'react-redux'
import {store, persistor} from '../redux/store';
import { PersistGate } from "redux-persist/integration/react"
import Layout from '../components/layout'

export default function App({ Component, pageProps }) {
  return(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  ) 
}
