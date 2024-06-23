import React, { useState, useEffect, useContext } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import { GlobalContext, GetRoutes } from './context';

import '@vkontakte/vkui/dist/vkui.css';
import Home from './panels/Home';
import FontDetail from './panels/FontDetail';

const Error = React.lazy(() => import('./panels/Error'));

const App = () => {
  const { path, appearance, Appearance } = useContext(GlobalContext);
  const [fetchedUser, User] = useState(null);
  const [fonts, setFonts] = useState([]);

  const VKBridgeSubscribeHandler = ({ detail: { type, data } }) => {
    if (type === 'VKWebAppUpdateConfig') {
      Appearance(data.appearance);
    }
  };

  useEffect(() => {
    bridge.subscribe(VKBridgeSubscribeHandler);
    bridge.send('VKWebAppGetUserInfo').then(User);
    fetch('fonts.json')
        .then((response) => response.json())
        .then((data) => setFonts(data))
        .catch((error) => console.error('Error fetching fonts:', error));

    return () => bridge.unsubscribe(VKBridgeSubscribeHandler);
  }, []);

  return (
      <ConfigProvider appearance={appearance}>
        <AdaptivityProvider>
          <AppRoot>
            <SplitLayout>
              <SplitCol>
                <GetRoutes index='home' fallback='404'>
                  <View id="home" activePanel={path}>
                    <Home id='home' />
                    {fonts.map((font) => (
                        <FontDetail key={font.id} id={`font_${font.id}`} font={font} />
                    ))}
                    <Error id='404' />
                  </View>
                </GetRoutes>
              </SplitCol>
            </SplitLayout>
          </AppRoot>
        </AdaptivityProvider>
      </ConfigProvider>
  );
};

export default App;
