import React from 'react'

export const AppContext = React.createContext({});

export const withAppContext = Wrapped => props => (
    <AppContext.Consumer>
      {state => <Wrapped {...props} {...state} />}
    </AppContext.Consumer>
)