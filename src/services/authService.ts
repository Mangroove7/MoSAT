import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signOut as fbSignOut, 
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from './firebase';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  targetScore: number;
  joinedAt: string;
  avatarColor: string;
  isFirebase?: boolean;
}

interface StoredAccount extends AuthUser {
  passwordHash: string;
}

const STORAGE_KEYS = {
  USERS_DB: 'mosat_users_database',
  CURRENT_USER: 'mosat_authenticated_user'
};

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-rose-500',
  'bg-amber-600',
  'bg-orange-600'
];

export class AuthService {
  private static authInitialized = false;

  private static getUsers(): StoredAccount[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS_DB);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  private static saveUsers(users: StoredAccount[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
  }

  static getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: AuthUser | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  // Real-time Auth state observer
  static initAuthListener(onUserChanged?: (user: AuthUser | null) => void): () => void {
    if (!auth || this.authInitialized) {
      return () => {};
    }
    this.authInitialized = true;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        let userProfile: AuthUser | null = null;
        if (db) {
          try {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              userProfile = {
                id: fbUser.uid,
                name: data.name || fbUser.displayName || 'SAT Scholar',
                email: fbUser.email || '',
                targetScore: data.targetScore || 1550,
                joinedAt: data.joinedAt || new Date().toISOString().split('T')[0],
                avatarColor: data.avatarColor || 'bg-orange-500',
                isFirebase: true
              };
            }
          } catch (err: any) {
            if (err?.code !== 'permission-denied') {
              console.warn('[MoSAT] Could not read Firestore profile, using auth metadata:', err);
            }
          }
        }

        if (!userProfile) {
          userProfile = {
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'SAT Scholar',
            email: fbUser.email || '',
            targetScore: 1550,
            joinedAt: new Date().toISOString().split('T')[0],
            avatarColor: 'bg-orange-500',
            isFirebase: true
          };
        }

        this.setCurrentUser(userProfile);
        if (onUserChanged) onUserChanged(userProfile);
      }
    });

    return unsubscribe;
  }

  // Unified Sign Up (Firebase with Local Fallback)
  static async signUp(
    name: string, 
    email: string, 
    password: string, 
    targetScore: number = 1550
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) return { success: false, error: 'Nama lengkap wajib diisi.' };
    if (!trimmedEmail || !trimmedEmail.includes('@')) return { success: false, error: 'Format email tidak valid.' };
    if (!password || password.length < 6) return { success: false, error: 'Password minimal 6 karakter untuk keamanan.' };

    // Try Firebase if configured
    if (auth && isFirebaseConfigured) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        await updateProfile(cred.user, { displayName: trimmedName });

        const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
        const profile: AuthUser = {
          id: cred.user.uid,
          name: trimmedName,
          email: trimmedEmail,
          targetScore,
          joinedAt: new Date().toISOString().split('T')[0],
          avatarColor: randomColor,
          isFirebase: true
        };

        if (db) {
          try {
            await setDoc(doc(db, 'users', cred.user.uid), {
              ...profile,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            });
          } catch (dbErr) {
            console.warn('[MoSAT] Firestore write warning (saved in Auth):', dbErr);
          }
        }

        this.setCurrentUser(profile);
        return { success: true, user: profile };
      } catch (err: any) {
        if (err.code === 'auth/email-already-in-use') {
          return { success: false, error: 'Email sudah terdaftar. Silakan masuk (Sign In).' };
        } else if (err.code === 'auth/invalid-email') {
          return { success: false, error: 'Alamat email tidak valid.' };
        } else if (err.code === 'auth/weak-password') {
          return { success: false, error: 'Password terlalu lemah. Gunakan minimal 6 karakter.' };
        }
        console.warn('[MoSAT] Firebase signup error, falling back to local storage:', err);
      }
    }

    // Local Fallback
    const users = this.getUsers();
    if (users.some(u => u.email === trimmedEmail)) {
      return { success: false, error: 'Email sudah terdaftar. Silakan masuk (Sign In).' };
    }

    const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newUser: StoredAccount = {
      id: `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmedName,
      email: trimmedEmail,
      passwordHash: password,
      targetScore,
      joinedAt: new Date().toISOString().split('T')[0],
      avatarColor: randomColor,
      isFirebase: false
    };

    users.push(newUser);
    this.saveUsers(users);

    const publicUser: AuthUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      targetScore: newUser.targetScore,
      joinedAt: newUser.joinedAt,
      avatarColor: newUser.avatarColor,
      isFirebase: false
    };

    this.setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  }

  // Unified Sign In (Firebase with Local Fallback)
  static async signIn(
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) return { success: false, error: 'Email wajib diisi.' };
    if (!password) return { success: false, error: 'Password wajib diisi.' };

    // Try Firebase if configured
    if (auth && isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        let userProfile: AuthUser | null = null;

        if (db) {
          try {
            const userDocSnap = await getDoc(doc(db, 'users', cred.user.uid));
            if (userDocSnap.exists()) {
              const data = userDocSnap.data();
              userProfile = {
                id: cred.user.uid,
                name: data.name || cred.user.displayName || 'SAT Scholar',
                email: trimmedEmail,
                targetScore: data.targetScore || 1550,
                joinedAt: data.joinedAt || new Date().toISOString().split('T')[0],
                avatarColor: data.avatarColor || 'bg-orange-500',
                isFirebase: true
              };
            }
          } catch (dbErr) {
            console.warn('[MoSAT] Firestore read profile warning:', dbErr);
          }
        }

        if (!userProfile) {
          userProfile = {
            id: cred.user.uid,
            name: cred.user.displayName || trimmedEmail.split('@')[0],
            email: trimmedEmail,
            targetScore: 1550,
            joinedAt: new Date().toISOString().split('T')[0],
            avatarColor: 'bg-orange-500',
            isFirebase: true
          };
        }

        this.setCurrentUser(userProfile);
        return { success: true, user: userProfile };
      } catch (err: any) {
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          // Check local fallback first before showing error
        } else if (err.code === 'auth/wrong-password') {
          return { success: false, error: 'Password salah. Mohon periksa kembali kata sandi Anda.' };
        } else if (err.code === 'auth/too-many-requests') {
          return { success: false, error: 'Terlalu banyak percobaan gagal. Silakan coba lagi nanti.' };
        }
      }
    }

    // Local Fallback
    const users = this.getUsers();
    const account = users.find(u => u.email === trimmedEmail);

    if (!account) {
      return { success: false, error: 'Akun dengan email ini tidak ditemukan. Silakan daftar lebih dulu.' };
    }

    if (account.passwordHash !== password) {
      return { success: false, error: 'Password salah. Mohon periksa kembali kata sandi Anda.' };
    }

    const publicUser: AuthUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      targetScore: account.targetScore,
      joinedAt: account.joinedAt,
      avatarColor: account.avatarColor,
      isFirebase: false
    };

    this.setCurrentUser(publicUser);
    return { success: true, user: publicUser };
  }

  // Google Sign-In with Firebase
  static async signInWithGoogle(): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    if (!auth || !isFirebaseConfigured) {
      return { 
        success: false, 
        error: 'Firebase Auth belum terhubung dengan API key aktif. Anda dapat masuk menggunakan akun demo atau email/password lokal.' 
      };
    }

    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;

      let userProfile: AuthUser = {
        id: fbUser.uid,
        name: fbUser.displayName || 'SAT Scholar',
        email: fbUser.email || '',
        targetScore: 1550,
        joinedAt: new Date().toISOString().split('T')[0],
        avatarColor: 'bg-orange-500',
        isFirebase: true
      };

      if (db) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            userProfile.targetScore = data.targetScore || 1550;
            userProfile.avatarColor = data.avatarColor || 'bg-orange-500';
          } else {
            await setDoc(userRef, {
              ...userProfile,
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            });
          }
        } catch (dbErr) {
          console.warn('[MoSAT] Firestore Google profile sync error:', dbErr);
        }
      }

      this.setCurrentUser(userProfile);
      return { success: true, user: userProfile };
    } catch (err: any) {
      console.error('[MoSAT Firebase Google Auth Error]:', err);
      const code = err?.code || '';
      if (code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Jendela login Google ditutup sebelum proses selesai.' };
      }
      if (code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'Proses login dibatalkan karena ada permintaan baru.' };
      }
      if (code === 'auth/popup-blocked') {
        return { 
          success: false, 
          error: 'Jendela popup Google diblokir oleh browser. Mohon izinkan pop-up untuk situs ini (klik ikon popup di kolom alamat browser).' 
        };
      }
      if (code === 'auth/unauthorized-domain') {
        const domain = typeof window !== 'undefined' ? window.location.hostname : 'domain ini';
        return { 
          success: false, 
          error: `Domain "${domain}" belum diizinkan di Firebase. Buka Firebase Console > Authentication > Settings > Authorized domains, lalu klik "Add domain" dan masukkan "${domain}".` 
        };
      }
      if (code === 'auth/operation-not-allowed' || code === 'auth/configuration-not-found') {
        return { 
          success: false, 
          error: 'Login Google belum diaktifkan di Firebase Console. Buka Firebase Console > Authentication > Sign-in method > Google, lalu aktifkan (Enable) dan simpan.' 
        };
      }
      if (code === 'auth/network-request-failed') {
        return { success: false, error: 'Koneksi jaringan terputus. Mohon periksa koneksi internet Anda.' };
      }
      return { 
        success: false, 
        error: `Gagal masuk dengan Google (${code || 'error'}): ${err.message || 'Periksa status autentikasi di Firebase Console.'}` 
      };
    }
  }

  static async signOut(): Promise<void> {
    if (auth && isFirebaseConfigured) {
      try {
        await fbSignOut(auth);
      } catch (err) {
        console.warn('[MoSAT] Firebase signOut error:', err);
      }
    }
    this.setCurrentUser(null);
  }

  static updateTargetScore(newScore: number): void {
    const current = this.getCurrentUser();
    if (!current) return;

    current.targetScore = newScore;
    this.setCurrentUser(current);

    if (db && current.isFirebase) {
      setDoc(doc(db, 'users', current.id), { targetScore: newScore }, { merge: true })
        .catch(err => {
          if (err?.code !== 'permission-denied') {
            console.warn('[MoSAT] Firestore targetScore update error:', err);
          }
        });
    }

    const users = this.getUsers();
    const target = users.find(u => u.id === current.id);
    if (target) {
      target.targetScore = newScore;
      this.saveUsers(users);
    }
  }
}
