import React from 'react';

const CareerServiceContext = React.createContext();

export const CareerServiceProvider = CareerServiceContext.Provider;
export const CareerServiceConsumer = CareerServiceContext.Consumer;