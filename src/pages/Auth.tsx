import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        navigate('/app');
      }
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    // Lenis smooth scrolling (for fun on larger pages)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Animate background shapes using GSAP and ScrollTrigger
    if (bgRef.current) {
      gsap.fromTo(
        bgRef.current.querySelectorAll('.bg-shape'),
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.3,
          scrollTrigger: {
            trigger: bgRef.current,
            start: 'top 80%',
          },
        }
      );
    }

    return () => {
      if (lenis.destroy) lenis.destroy();
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Signed in successfully!');
        navigate('/app');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        toast.success('Signed up successfully! Please check your email for verification.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Animated background elements */}
      <div ref={bgRef} className="absolute inset-0 z-0 overflow-hidden">
        <div className="bg-shape absolute top-[-40px] left-[-40px] w-32 h-32 bg-yellow-300 border-4 border-pop-black transform rotate-12"></div>
        <div className="bg-shape absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-blue-300 border-4 border-pop-black transform -rotate-12"></div>
        <div className="bg-shape absolute top-20 right-[-20px] w-16 h-16 bg-red-300 border-4 border-pop-black transform rotate-45"></div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-md w-full space-y-8 bg-white p-8 border-4 border-pop-black shadow-brutal rounded-lg"
        >
          <div className="text-center">
            <motion.h2
              whileHover={{ scale: 1.05 }}
              className="mt-6 text-3xl font-bebas tracking-wide text-gray-900"
            >
              {mode === 'signin' ? 'SIGN IN TO POPNEWS' : 'CREATE YOUR POPNEWS ACCOUNT'}
            </motion.h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleAuth}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-pop-black"
                  />
                </motion.div>
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-2 border-pop-black"
                  />
                </motion.div>
              </div>
            </div>

            <div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="btn-brutal w-full py-3"
                  disabled={loading}
                >
                  {loading ? 'PROCESSING...' : mode === 'signin' ? 'SIGN IN' : 'SIGN UP'}
                </Button>
              </motion.div>
            </div>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              type="button"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
