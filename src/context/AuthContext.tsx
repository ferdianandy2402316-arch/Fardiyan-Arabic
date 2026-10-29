import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'student' | 'admin';
  points: number;
  completedLessons: string[];
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  loginAsAdmin: (username: string, pw: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemoStudent: (name?: string) => void;
  logout: () => Promise<void>;
  addPoints: (amount: number) => Promise<void>;
  markLessonComplete: (lessonId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'ferdian.andy.2402316@students.um.ac.id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check stored custom admin session
  useEffect(() => {
    const storedAdmin = localStorage.getItem('arabiyah_admin_session');
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setUser(parsed);
      } catch (e) {
        localStorage.removeItem('arabiyah_admin_session');
      }
    }
  }, []);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          let userSnap;
          try {
            userSnap = await getDoc(userDocRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
          }

          const isFerdiEmail = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (userSnap && userSnap.exists()) {
            const data = userSnap.data();
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || 'Santri MTsN',
              photoURL: fbUser.photoURL,
              role: isFerdiEmail ? 'admin' : (data.role || 'student'),
              points: data.points || 0,
              completedLessons: data.completedLessons || [],
            });
          } else {
            // Create user profile in Firestore
            const initialUser: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || 'Santri MTsN',
              photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${fbUser.uid}`,
              role: isFerdiEmail ? 'admin' : 'student',
              points: 50, // Welcome points
              completedLessons: [],
            };

            try {
              await setDoc(userDocRef, {
                id: initialUser.uid,
                email: initialUser.email,
                displayName: initialUser.displayName,
                photoURL: initialUser.photoURL,
                role: initialUser.role,
                points: initialUser.points,
                completedLessons: initialUser.completedLessons,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${fbUser.uid}`);
            }

            setUser(initialUser);
          }
        } catch (error) {
          console.error('Error fetching or creating user profile:', error);
          // Fallback user state from fbUser
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Santri MTsN',
            photoURL: fbUser.photoURL,
            role: fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'student',
            points: 50,
            completedLessons: [],
          });
        }
      } else {
        // If not firebase user, check if we have a custom Ferdi admin login
        const storedAdmin = localStorage.getItem('arabiyah_admin_session');
        if (storedAdmin) {
          try {
            setUser(JSON.parse(storedAdmin));
          } catch {
            setUser(null);
          }
        } else {
          const storedGuest = localStorage.getItem('arabiyah_guest_session');
          if (storedGuest) {
            try {
              setUser(JSON.parse(storedGuest));
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem('arabiyah_admin_session');
      localStorage.removeItem('arabiyah_guest_session');
    } catch (error) {
      console.error('Google Sign In Error:', error);
      throw error;
    }
  };

  const loginAsAdmin = async (username: string, pw: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pw }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        const adminUser: AppUser = {
          uid: data.user.uid,
          email: data.user.email,
          displayName: data.user.displayName,
          photoURL: data.user.photoURL,
          role: 'admin',
          points: 9999,
          completedLessons: ['mufrodat', 'hiwar', 'qawaid', 'qiraah'],
        };
        setUser(adminUser);
        localStorage.setItem('arabiyah_admin_session', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login gagal' };
    } catch (err) {
      // Local fallback for offline/direct dev check
      if (username === 'Ferdi' && pw === 'Ferdi123') {
        const adminUser: AppUser = {
          uid: 'admin-ferdi-mtsn',
          email: 'ferdi@mtsn.sch.id',
          displayName: 'Ferdi (Admin Pengajar MTsN)',
          photoURL: 'https://api.dicebear.com/7.x/bottts/svg?seed=FerdiAdmin',
          role: 'admin',
          points: 9999,
          completedLessons: ['mufrodat', 'hiwar', 'qawaid', 'qiraah'],
        };
        setUser(adminUser);
        localStorage.setItem('arabiyah_admin_session', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Username atau password salah' };
    }
  };

  const loginAsDemoStudent = (name = 'Ahmad Santri MTsN') => {
    const demoUser: AppUser = {
      uid: 'guest-' + Date.now(),
      email: 'santri.mtsn@madrasah.id',
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
      role: 'student',
      points: 100,
      completedLessons: ['mufrodat'],
    };
    setUser(demoUser);
    localStorage.setItem('arabiyah_guest_session', JSON.stringify(demoUser));
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout issue:', err);
    }
    localStorage.removeItem('arabiyah_admin_session');
    localStorage.removeItem('arabiyah_guest_session');
    setUser(null);
  };

  const addPoints = async (amount: number) => {
    if (!user) return;
    const newPoints = (user.points || 0) + amount;
    setUser({ ...user, points: newPoints });

    // Update in Firestore if logged in with Firebase
    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { points: newPoints, updatedAt: new Date().toISOString() }, { merge: true });
      } catch (err) {
        console.warn('Could not update points in firestore:', err);
      }
    }
  };

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;
    if (user.completedLessons.includes(lessonId)) return;

    const updatedLessons = [...user.completedLessons, lessonId];
    const newPoints = user.points + 50; // Award 50 points per completed module
    setUser({ ...user, completedLessons: updatedLessons, points: newPoints });

    if (firebaseUser) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(
          userRef,
          {
            completedLessons: updatedLessons,
            points: newPoints,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Could not save lesson progress:', err);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        isAdmin,
        signInWithGoogle,
        loginAsAdmin,
        loginAsDemoStudent,
        logout,
        addPoints,
        markLessonComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
