import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import { SignUpPage } from './pages/Auth/SignUpPage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Amplify } from "aws-amplify";


const region = import.meta.env.REACT_APP_PROJECT_REGION;
const userPoolId = import.meta.env.REACT_APP_USER_POOLS_ID;
const userPoolWebClientId = import.meta.env.REACT_APP_USER_POOLS_WEB_CLIENT_ID;
const bucketName = import.meta.env.REACT_APP_BUCKET_NAME;
const identityPoolId = import.meta.env.REACT_APP_COGNITO_IDENTITY_POOL_ID;

Amplify.configure({
  Auth: {
    region,
    identityPoolId,
    userPoolId,
    userPoolWebClientId,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
  Storage: {
    AWSS3: {
      bucket: bucketName,
      region,
    },
  },
  // Analytics: {
  //   disabled: true,
  // },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: true,
      retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 30000), // 0.5s, 1s, 2s, 4s etc. up to max 30s
      staleTime: 3000, // 3s
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 1 },
  },
});

const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
