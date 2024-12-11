import React from 'react';
import {
  enableStaticRendering
} from 'mobx-react';

import GlobalStore from './GlobalStore';

enableStaticRendering(typeof window === 'undefined');

export const storesContext = React.createContext({
  global: new GlobalStore(),
});
