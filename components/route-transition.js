// src/components/RouteTransition.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const RouteTransition = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Adjust timing as needed
    return () => clearTimeout(timer);
  }, [location]);

  return isLoading ? <LoadingSpinner /> : <>{children}</>;
};

export default RouteTransition;