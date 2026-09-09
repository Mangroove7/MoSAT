import { 
  UserProfile, 
  UserMistakeRecord, 
  DrillSessionResult, 
  MockTestAttempt, 
  SATQuestion,
  ErrorType 
} from '../types/sat';
import { AuthService } from './authService';
import { SEED_QUESTIONS } from '../data/questionsSeed';
import { db } from './firebase';
import { doc, setDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore';


// Native IndexedDB Helper for zero-latency question caching
const IDB_NAME = 'mosat_db';
const IDB_STORE = 'questions';

function getIdbQuestions(): Promise<SATQuestion[] | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve(null);
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const getReq = store.get('all_questions');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function saveIdbQuestions(questions: SATQuestion[]): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve();
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = (e: any) => {
        const db = e.target.result;
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.put(questions, 'all_questions');
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      req.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export class StorageService {
  private static getUserId(): string {
    const user = AuthService.getCurrentUser();
    return user ? user.id : 'guest';
  }

  private static key(base: string): string {
    return `mosat_${this.getUserId()}_${base}`;
  }

  static getProfile(): UserProfile {
    const user = AuthService.getCurrentUser();
    const defaultProfile: UserProfile = {
      name: user ? user.name : 'Tamu (Guest)',
      targetScore: user ? user.targetScore : 1550,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyGoal: 20,
      todayAnsweredCount: 0,
      totalAnswered: 0,
      totalCorrect: 0,
      favoriteQuestionIds: [],
      activityHistory: {}
    };

    try {
      const raw = localStorage.getItem(this.key('profile'));
      if (!raw) {
        this.saveProfile(defaultProfile);
        return defaultProfile;
      }
      const profile: UserProfile = JSON.parse(raw);
      if (user && profile.name !== user.name) {
        profile.name = user.name;
        profile.targetScore = user.targetScore;
      }

      // Check daily streak renewal
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastActiveDate !== today) {
        const lastDate = new Date(profile.lastActiveDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        
        if (diffDays === 1) {
          // Continuous
        } else if (diffDays > 1) {
          profile.streak = 1;
        }
        profile.todayAnsweredCount = 0;
        profile.lastActiveDate = today;
        this.saveProfile(profile);
      }
      return profile;
    } catch {
      return defaultProfile;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(this.key('profile'), JSON.stringify(profile));

    // Cloud sync if user logged into Firebase
    const user = AuthService.getCurrentUser();
    if (db && user && user.isFirebase) {
      try {
        setDoc(doc(db, 'users', user.id), {
          profile,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(err => { if (err?.code !== 'permission-denied') console.warn('[MoSAT] Cloud profile sync notice:', err); });
      } catch {}
    }
  }

  static updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated: UserProfile = {
      ...current,
      ...updates
    };
    this.saveProfile(updated);

    if (updates.targetScore) {
      AuthService.updateTargetScore(updates.targetScore);
    }
    return updated;
  }

  static savePreTestResult(score: number, rwScore: number, mathScore: number): UserProfile {
    return this.updateProfile({
      baselineScore: score,
      preTestCompleted: true,
      preTestDetails: {
        date: new Date().toISOString().split('T')[0],
        score,
        rwScore,
        mathScore
      }
    });
  }

  static recordQuestionAnswered(questionId: string, isCorrect: boolean): void {
    const profile = this.getProfile();
    const today = new Date().toISOString().split('T')[0];
    
    profile.todayAnsweredCount += 1;
    profile.totalAnswered += 1;
    if (isCorrect) profile.totalCorrect += 1;
    profile.lastActiveDate = today;
    
    if (!profile.activityHistory) profile.activityHistory = {};
    profile.activityHistory[today] = (profile.activityHistory[today] || 0) + 1;
    
    this.saveProfile(profile);
  }

  // Mistakes (Buku Dosa)
  static getMistakes(): UserMistakeRecord[] {
    try {
      const raw = localStorage.getItem(this.key('mistakes'));
      if (!raw) {
        const initial: UserMistakeRecord[] = [
          {
            id: 'mistake-demo-1',
            questionId: 'ac472881',
            userAnswer: '31',
            correctAnswer: '403',
            date: new Date().toISOString().split('T')[0],
            errorType: 'careless',
            userNotes: 'Lupa mengalikan 31 dengan 13 di langkah akhir aljabar!',
            resolved: false
          }
        ];
        this.saveMistakes(initial);
        return initial;
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveMistakes(mistakes: UserMistakeRecord[]): void {
    localStorage.setItem(this.key('mistakes'), JSON.stringify(mistakes));
  }

  static addMistake(
    questionId: string, 
    userAnswer: string, 
    correctAnswer: string, 
    errorType: ErrorType = 'careless',
    userNotes: string = ''
  ): void {
    const mistakes = this.getMistakes();
    const existing = mistakes.find(m => m.questionId === questionId && !m.resolved);
    let targetMistake: UserMistakeRecord;

    if (existing) {
      existing.userAnswer = userAnswer;
      existing.errorType = errorType;
      existing.userNotes = userNotes || existing.userNotes;
      targetMistake = existing;
    } else {
      targetMistake = {
        id: `mistake-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        questionId,
        userAnswer,
        correctAnswer,
        date: new Date().toISOString().split('T')[0],
        errorType,
        userNotes,
        resolved: false
      };
      mistakes.unshift(targetMistake);
    }
    this.saveMistakes(mistakes);

    // Sync individual mistake to Firestore
    const user = AuthService.getCurrentUser();
    if (db && user && user.isFirebase) {
      try {
        setDoc(doc(db, 'users', user.id, 'mistakes', targetMistake.id), {
          ...targetMistake,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(err => console.warn('[MoSAT] Cloud mistake sync notice:', err));
      } catch {}
    }
  }

  static resolveMistake(mistakeId: string): void {
    const mistakes = this.getMistakes();
    const item = mistakes.find(m => m.id === mistakeId);
    if (item) {
      item.resolved = true;
      this.saveMistakes(mistakes);

      const user = AuthService.getCurrentUser();
      if (db && user && user.isFirebase) {
        try {
          setDoc(doc(db, 'users', user.id, 'mistakes', mistakeId), {
            resolved: true,
            resolvedAt: serverTimestamp()
          }, { merge: true }).catch(err => console.warn('[MoSAT] Cloud resolve mistake sync notice:', err));
        } catch {}
      }
    }
  }

  static updateMistakeNotes(mistakeId: string, notes: string, errorType?: ErrorType): void {
    const mistakes = this.getMistakes();
    const item = mistakes.find(m => m.id === mistakeId);
    if (item) {
      item.userNotes = notes;
      if (errorType) item.errorType = errorType;
      this.saveMistakes(mistakes);

      const user = AuthService.getCurrentUser();
      if (db && user && user.isFirebase) {
        try {
          setDoc(doc(db, 'users', user.id, 'mistakes', mistakeId), {
            userNotes: notes,
            ...(errorType ? { errorType } : {}),
            updatedAt: serverTimestamp()
          }, { merge: true }).catch(err => console.warn('[MoSAT] Cloud mistake notes sync notice:', err));
        } catch {}
      }
    }
  }

  // Drill Sessions
  static getDrillHistory(): DrillSessionResult[] {
    try {
      const raw = localStorage.getItem(this.key('drills'));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveDrillSession(session: DrillSessionResult): void {
    const history = this.getDrillHistory();
    history.unshift(session);
    localStorage.setItem(this.key('drills'), JSON.stringify(history.slice(0, 50)));

    const user = AuthService.getCurrentUser();
    if (db && user && user.isFirebase) {
      try {
        setDoc(doc(db, 'users', user.id, 'drills', session.id), {
          ...session,
          createdAt: serverTimestamp()
        }).catch(err => console.warn('[MoSAT] Cloud drill sync notice:', err));
      } catch {}
    }
  }

  // Mock Tests
  static getMockTestHistory(): MockTestAttempt[] {
    try {
      const raw = localStorage.getItem(this.key('mock_tests'));
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveMockTestHistory(history: MockTestAttempt[]): void {
    localStorage.setItem(this.key('mock_tests'), JSON.stringify(history.slice(0, 30)));
  }

  static saveMockTestAttempt(attempt: MockTestAttempt): void {
    this.recordMockAttempt(attempt);
  }

  static recordMockAttempt(attempt: MockTestAttempt): void {
    const history = this.getMockTestHistory();
    history.unshift(attempt);
    this.saveMockTestHistory(history);

    const user = AuthService.getCurrentUser();
    if (db && user && user.isFirebase) {
      try {
        setDoc(doc(db, 'users', user.id, 'attempts', attempt.id), {
          ...attempt,
          savedAt: serverTimestamp()
        }).catch(err => console.warn('[MoSAT] Cloud attempt sync notice:', err));
      } catch {}
    }
  }

  // Two-way Cloud Sync
  static async syncFromCloud(): Promise<boolean> {
    const user = AuthService.getCurrentUser();
    if (!db || !user || !user.isFirebase) return false;

    try {
      // 1. Sync mistakes subcollection
      const mistakesSnap = await getDocs(collection(db, 'users', user.id, 'mistakes'));
      if (!mistakesSnap.empty) {
        const cloudMistakes: UserMistakeRecord[] = [];
        mistakesSnap.forEach(d => {
          cloudMistakes.push(d.data() as UserMistakeRecord);
        });
        if (cloudMistakes.length > 0) {
          this.saveMistakes(cloudMistakes);
        }
      }

      // 2. Sync attempts subcollection
      const attemptsSnap = await getDocs(collection(db, 'users', user.id, 'attempts'));
      if (!attemptsSnap.empty) {
        const cloudAttempts: MockTestAttempt[] = [];
        attemptsSnap.forEach(d => {
          cloudAttempts.push(d.data() as MockTestAttempt);
        });
        if (cloudAttempts.length > 0) {
          this.saveMockTestHistory(cloudAttempts);
        }
      }

      return true;
    } catch (err) {
      if ((err as any)?.code !== 'permission-denied') console.warn('[MoSAT] Cloud restore note:', err);
      return false;
    }
  }

  // Asynchronous Questions Database with Memory Cache & IndexedDB
  private static fullBankLoaded = false;
  private static questionCache: SATQuestion[] = [];
  private static loadingPromise: Promise<SATQuestion[]> | null = null;
  private static subscribers: Array<(count: number) => void> = [];

  static onQuestionsLoaded(callback: (count: number) => void): () => void {
    this.subscribers.push(callback);
    if (this.fullBankLoaded) {
      callback(this.getAllQuestions().length);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private static notifySubscribers(): void {
    const total = this.getAllQuestions().length;
    this.subscribers.forEach(cb => {
      try { cb(total); } catch {}
    });
  }

  static async loadFullQuestionBank(): Promise<SATQuestion[]> {
    if (this.fullBankLoaded && this.questionCache.length > 0) {
      return this.getAllQuestions();
    }
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = (async () => {
      // 1. Try instant load from IndexedDB first (takes ~20ms)
      try {
        const cached = await getIdbQuestions();
        if (Array.isArray(cached) && cached.length > 100) {
          this.questionCache = cached;
          this.fullBankLoaded = true;
          this.notifySubscribers();
          return this.getAllQuestions();
        }
      } catch {}

      // 2. Fetch full question bank if not in IndexedDB
      try {
        const res = await fetch('/sat_questions_1000.json');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            this.questionCache = data;
            this.fullBankLoaded = true;
            this.notifySubscribers();
            saveIdbQuestions(data).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('[MoSAT] Question bank fetch notice:', err);
      }
      return this.getAllQuestions();
    })();

    return this.loadingPromise;
  }

  static getAllQuestions(): SATQuestion[] {
    const customImported = this.getCustomQuestions();
    const questionMap = new Map<string, SATQuestion>();

    const addValid = (q: SATQuestion) => {
      if (q && q.id && q.stem && q.stem.trim().length > 0) {
        questionMap.set(q.id, q);
      }
    };

    for (const q of this.questionCache) {
      addValid(q);
    }
    for (const q of SEED_QUESTIONS) {
      if (!questionMap.has(q.id)) {
        addValid(q);
      }
    }
    for (const q of customImported) {
      addValid(q);
    }

    return Array.from(questionMap.values());
  }

  static getCustomQuestions(): SATQuestion[] {
    try {
      const raw = localStorage.getItem('mosat_custom_questions_pool');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  static saveCustomQuestions(newQuestions: SATQuestion[]): number {
    const current = this.getCustomQuestions();
    const map = new Map<string, SATQuestion>();
    for (const q of current) map.set(q.id, q);
    let addedCount = 0;
    for (const q of newQuestions) {
      if (!map.has(q.id)) {
        map.set(q.id, q);
        addedCount++;
      }
    }
    localStorage.setItem('mosat_custom_questions_pool', JSON.stringify(Array.from(map.values())));
    return addedCount;
  }

  static importQuestions(newQuestions: SATQuestion[]): number {
    return this.saveCustomQuestions(newQuestions);
  }

  // Vocabulary Mastery Tracking
  static getVocabMastery(): Record<string, 'new' | 'learning' | 'mastered'> {
    try {
      const raw = localStorage.getItem(this.key('vocab_mastery'));
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  static setVocabMastery(id: string, status: 'new' | 'learning' | 'mastered'): void {
    const current = this.getVocabMastery();
    current[id] = status;
    localStorage.setItem(this.key('vocab_mastery'), JSON.stringify(current));
  }
}
