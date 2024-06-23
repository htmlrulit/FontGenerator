import React, { useEffect, createContext, useContext, useState } from "react";

const defaultData = {
  path: "home",
  aviableRoutes: [],
  fallback: "404",
  appearance: "light"
};

const GlobalContext = createContext(defaultData);

const GlobalProvider = ({ children }) => {
  const [data, Data] = useState(defaultData);

  const go = (path) => {
    if (data.aviableRoutes.includes(path)) {
      Data((e) => ({ ...e, path }));
    } else {
      Data((e) => ({ ...e, path: e.fallback }));
    }
  };

  const Appearance = (appearance) => {
    Data((e) => ({ ...e, appearance }));
  };

  return (
      <GlobalContext.Provider value={{ ...data, setGlobalData: Data, Appearance, go }}>
        {children}
      </GlobalContext.Provider>
  );
};

const GetRoutes = ({ children, fallback = "404", index = "home" }) => {
  const { setGlobalData, aviableRoutes } = useContext(GlobalContext);

  useEffect(() => {
    const rc = React.Children.toArray(children.props.children);
    const newRoutes = rc.map((child) => child.props.id);

    if (aviableRoutes.join(',') !== newRoutes.join(',')) {
      setGlobalData((e) => ({
        ...e,
        fallback,
        index,
        aviableRoutes: newRoutes
      }));
    }
  }, [children, fallback, index, aviableRoutes, setGlobalData]);

  return <>{children}</>;
};

export { GlobalContext, GlobalProvider, GetRoutes };
