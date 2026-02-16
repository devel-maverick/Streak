import { create } from 'zustand';

export const useUIStore = create((set) => ({
    isSignInOpen: false,
    isSignUpOpen: false,

    openSignIn: () => set({ isSignInOpen: true, isSignUpOpen: false }),
    closeSignIn: () => set({ isSignInOpen: false }),

    openSignUp: () => set({ isSignUpOpen: true, isSignInOpen: false }),
    closeSignUp: () => set({ isSignUpOpen: false }),

    toggleSignIn: () => set((state) => ({ isSignInOpen: !state.isSignInOpen })),
    toggleSignUp: () => set((state) => ({ isSignUpOpen: !state.isSignUpOpen })),
}));
