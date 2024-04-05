import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './App.css';

import { ERR_404 } from './views/ERR_404';
import AuthRoutesGuard from './lib/AuthRoutesGuard';
import StandardRoutesGuard from './lib/StandardRoutesGuard';
import { authRoutes, standardRoutes } from './routes/routes';

interface RouteContextType {
    currentpage: string,
    from: string
}

const RoutingContext = React.createContext<RouteContextType>(null!)

export default function App() {
    const RouterProvider = ({ children }: { children: React.ReactNode }) => {
        const currentLocation = useLocation()
        const [route, setRoute] = useState({
            currentpage: currentLocation.pathname,
            from: ''
        })

        useEffect(() => {
            setRoute((prev) => ({ currentpage: currentLocation.pathname, from: prev.currentpage }))
        }, [currentLocation])

        return <RoutingContext.Provider value={route}>
            {children}
        </RoutingContext.Provider>
    }

    return (
        <Router basename='/'>
            <RouterProvider>
                <Routes>
                    <Route element={<AuthRoutesGuard />}>
                        {authRoutes.map((route, index) => {
                            return (
                                <Route
                                    path={route.path}
                                    element={route.element}
                                    key={index}
                                />
                            )
                        })
                        }
                    </Route>

                    <Route element={<StandardRoutesGuard />} >
                        {
                            standardRoutes.map((route, index) => {
                                return (
                                    <Route
                                        path={route.path}
                                        element={route.element}
                                        key={index}
                                    />
                                )
                            })
                        }
                    </Route>

                    <Route path="*" element={<ERR_404 />} />

                </Routes>
            </RouterProvider>
        </Router>
    )
}