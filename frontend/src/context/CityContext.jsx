import React, { createContext, useContext, useState } from 'react';

const CityContext = createContext();

export const CITY_ZONES = [
  'All Zones',
  'Hyderabad Central',
  'Hitech City',
  'Madhapur',
  'Gachibowli',
  'Kukatpally',
  'Secunderabad',
  'Banjara Hills',
  'Jubilee Hills',
];

export const CityProvider = ({ children }) => {
  const [selectedZone, setSelectedZone] = useState('All Zones');
  const [isSimulating, setIsSimulating] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const triggerRefresh = () => {
    setLastUpdated(new Date());
  };

  return (
    <CityContext.Provider
      value={{
        selectedZone,
        setSelectedZone,
        isSimulating,
        setIsSimulating,
        lastUpdated,
        triggerRefresh,
        zones: CITY_ZONES,
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
