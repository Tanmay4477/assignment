"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/utils/supabaseClient';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);
  
  try {
    // 1. Register with Supabase Auth
    await signUp(email, password);
    
    // Get the current user after signup
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.user) {
      setLoading(false);
      router.push('/signup/confirm');
      return;
    }
    
    const newUserId = session.user.id;
    
    // 2. Update the user's full name in the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', newUserId);
      
    if (updateError) throw updateError;
    
    // 3. Create connections with existing users
    await createChatsWithExistingUsers(newUserId);
    
    // Redirect to dashboard
    router.push('/dashboard');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) { 
    console.error('Signup error:', error);
    setError(error.message || 'An error occurred during signup');
  } finally {
    setLoading(false);
  }
};
  
  // Function to create chats with existing users
  const createChatsWithExistingUsers = async (newUserId: string) => {
    try {
      // Get existing users (limit to 5 for demo purposes)
      const { data: existingUsers, error: usersError } = await supabase
        .from('users')
        .select('id, full_name')
        .not('id', 'eq', newUserId)
        .limit(5);
        
      if (usersError) throw usersError;
      if (!existingUsers || existingUsers.length === 0) return;
      
      // Create a chat with each existing user
      for (const existingUser of existingUsers) {
        // Create a direct chat
        const { data: newChat, error: chatError } = await supabase
          .from('chats')
          .insert({
            name: null, // No name for direct chats
            is_group: false
          })
          .select()
          .single();
          
        if (chatError || !newChat) {
          console.error(`Error creating chat with ${existingUser.full_name}:`, chatError);
          continue;
        }
        
        // Add both users as participants
        await supabase
          .from('chat_participants')
          .insert([
            {
              chat_id: newChat.id,
              user_id: newUserId
            },
            {
              chat_id: newChat.id,
              user_id: existingUser.id
            }
          ]);
          
        // Add a default tag
        await supabase
          .from('chat_tags')
          .insert({
            chat_id: newChat.id,
            name: 'New',
            color: '#2196f3'
          });
          
        // Add welcome message from existing user
        const { data: message, error: messageError } = await supabase
          .from('messages')
          .insert({
            chat_id: newChat.id,
            user_id: existingUser.id,
            content: `Hi there! I'm ${existingUser.full_name}. Welcome to the chat app!`
          })
          .select()
          .single();
          
        if (messageError || !message) {
          console.error(`Error creating welcome message:`, messageError);
          continue;
        }
        
        // Set message status
        await supabase
          .from('message_status')
          .insert([
            {
              message_id: message.id,
              user_id: existingUser.id,
              status: 'sent'
            },
            {
              message_id: message.id,
              user_id: newUserId,
              status: 'delivered'
            }
          ]);
      }
    } catch (error) {
      console.error('Error creating chats with existing users:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join our messaging platform and connect with others
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="full-name" className="sr-only">Full name</label>
              <input
                id="full-name"
                name="full-name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}