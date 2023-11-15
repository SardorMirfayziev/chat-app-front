// src/components/SignUp.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { Auth } from '@aws-amplify/auth';
import { signUpSchema } from '../../validation/schemas';

type SignUpFormValues = {
  email: string;
};

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: createUserRecord } = useMutation(
    (email: string) => {
      // API call to create a record in your backend
      return fetch('YOUR_API_GATEWAY_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    },
    {
      onSuccess: () => {
        // Handle success
      },
      onError: (error: any) => {
        // Handle error
        console.error('Error creating user record:', error);
      },
    }
  );

  const onSubmit: SubmitHandler<SignUpFormValues> = async ({ email }) => {
    try {
      await Auth.signUp({
        username: email,
        password: 'defaultPasswordToChangeLater', // You should generate a secure password or prompt the user for one
      });
      createUserRecord(email);
    } catch (error: any) {
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border ${
              errors.email ? 'border-red-500' : 'rounded'
            } w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id="email"
            type="email"
            {...register('email')}
            placeholder="Email"
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isSubmitting}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
