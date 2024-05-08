import { ToastContainer } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'

import './App.css';
import './assets/css/beska.css'
import "react-toastify/dist/ReactToastify.css"
import './assets/icons/fontawesome_6_pro/css/all.css'

import { ERR_404 } from './views/errors/ERR_404';
import AuthRoutesGuard from './lib/guards/AuthRoutesGuard';
import ErrorRoutesGuard from './lib/guards/ErrorRoutesGuard';
import CommonRoutesGuard from './lib/guards/CommonRoutesGuard';
import GenericRoutesGuard from './lib/guards/GenericRoutesGuard';
import PostAuthRouteGuard from './lib/guards/PostAuthRouteGuard';
import SettingsRoutesGuard from './lib/guards/SettingsRoutesGuard';
import StandardRoutesGuard from './lib/guards/StandardRoutesGuard';
import { 
    commonRoutes, 
    genericRoutes, 
    standardRoutes, 
    postAuthRoutes, 
    standardErrorRoutes, 
    authenticationRoutes, 
    standardSettingsRoutes 
} from './routes/routes';
import { Helmet } from 'react-helmet';

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
                <ToastContainer />

                <Helmet>
                    <meta name="theme-color" content="#F97316" />  
                </Helmet>

                <Routes>
                    <Route element={<AuthRoutesGuard />}>
                        {
                            authenticationRoutes.map((route, index) => {
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

                    <Route element={<PostAuthRouteGuard />}>
                        {
                            postAuthRoutes.map((route, index) => {
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

                    <Route element={<CommonRoutesGuard />} >
                        {
                            commonRoutes.map((route, index) => {
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

                    <Route element={<GenericRoutesGuard />} >
                        {
                            genericRoutes.map((route, index) => {
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

                    <Route element={<SettingsRoutesGuard />} >
                        {
                            standardSettingsRoutes.map((route, index) => {
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

                    <Route element={<ErrorRoutesGuard />} >
                        {
                            standardErrorRoutes.map((route, index) => {
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