import { createContext, useContext, useState } from "react";

const ConfiguratorContext = createContext();

export const ConfiguratorProvider = ({ children }) => {
  const [isAnimationPlay, setAnimationPlay] = useState(false);

  return (
    <ConfiguratorContext.Provider
      value={{
        isAnimationPlay,
        setAnimationPlay
      }}
    >
      {children}
    </ConfiguratorContext.Provider>
  );
};

export const useConfigurator = () => {
  return useContext(ConfiguratorContext);
};
