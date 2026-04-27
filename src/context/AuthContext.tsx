import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ADMIN_EMAILS = ["allieswebers@gmail.com"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.email ? ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase()) : false;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // If the user hasn't verified their email, do not set them as the active user.
      if (currentUser && !currentUser.emailVerified) {
        await signOut(auth);
        setUser(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting signup for:", email.trim());
      const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
      console.log("User created successfully:", result.user.uid);
      
      // Update profile with name
      if (result.user) {
        try {
          await updateProfile(result.user, { displayName: name.trim() });
          console.log("Profile updated with name:", name.trim());
        } catch (profileError) {
          console.error("Profile update failed, but user was created:", profileError);
          // Continue anyway since account is created
        }
        
        await sendEmailVerification(result.user);
        await signOut(auth);
        
        // Force a re-fetch of the user object to sync the displayName to the local state
        setUser(null);
      }
    } catch (error: any) {
      console.error("Signup failed with error code:", error.code);
      console.error("Signup error details:", error.message);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user && !result.user.emailVerified) {
        await signOut(auth);
        throw new Error('Please verify your email before logging in.');
      }
    } catch (error) {
      console.error("Sign-in failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithGoogle, signUpWithEmail, signInWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
