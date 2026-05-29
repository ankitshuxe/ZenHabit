import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import Button from '../components/Button';
import BottomSheet from '../components/BottomSheet';
import { useHabitStore } from '../store/useHabitStore';
import { Mail, User } from 'lucide-react-native';
import { GoogleIcon, AppleIcon } from '../components/SocialIcons';
import { Heading, Title, Body, Caption } from '../components/Typography';
import { supabase, isConfigured } from '../lib/supabase';
import { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';

WebBrowser.maybeCompleteAuthSession();

GoogleSignin.configure({
  webClientId: '100342460316-rdv228qkjeon4nkgca04c9tuj1bd730c.apps.googleusercontent.com',
});

export default function LoginScreen({ theme }) {
  const setLoggedIn = useHabitStore((state) => state.setLoggedIn);
  const setUserName = useHabitStore((state) => state.setUserName);
  const showPopup = useHabitStore((state) => state.showPopup);
  const [mode, setMode] = useState('home'); // 'home' or 'email'
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGuestAuth = () => {
    setUserName('Guest');
    setLoggedIn(true);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        if (idToken) {
          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: 'google',
            token: idToken,
          });
          if (error) throw error;
          
          setUserName(data?.user?.user_metadata?.full_name || 'User');
          setLoggedIn(true);
        }
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code !== statusCodes.SIGN_IN_CANCELLED && error.code !== statusCodes.IN_PROGRESS) {
           showPopup('Google Auth Error', error.message);
        }
      } else {
        showPopup('Google Auth Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    try {
      const redirectUrl = Linking.createURL('/auth-callback');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      
      // If mock is running, bypass browser
      if (!isConfigured) {
        setLoggedIn(true);
        return;
      }
      
      if (data?.url) {
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (res.type === 'success' && res.url) {
          const { queryParams } = Linking.parse(res.url);
          if (queryParams?.code) {
             await supabase.auth.exchangeCodeForSession(queryParams.code);
          } else if (res.url.includes('access_token=')) {
             const match = res.url.match(/access_token=([^&]+)/);
             const refreshMatch = res.url.match(/refresh_token=([^&]+)/);
             if (match && refreshMatch) {
               await supabase.auth.setSession({ access_token: match[1], refresh_token: refreshMatch[1] });
             }
          }
        }
      }
    } catch (error) {
      showPopup('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password || (isSignUp && !name)) {
      showPopup('Missing Info', 'Please fill in all fields to continue.');
      return;
    }
    
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        setUserName(name);
        setLoggedIn(true);
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUserName(data?.user?.user_metadata?.full_name || 'User');
        setLoggedIn(true);
      }
    } catch (error) {
      showPopup('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <View style={styles.content}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Heading color={theme.text} style={styles.title}>ZenHabit</Heading>
        <Heading color={theme.accent} style={styles.title}>.</Heading>
      </View>
      <Body color={theme.textSecondary} style={styles.subtitle}>Choose how you want to sign in.</Body>

      <Button 
        title="Continue with Email" 
        onPress={() => setMode('email')} 
        theme={theme} 
        variant="card" 
        icon={<Mail color={theme.text} size={20} strokeWidth={2} />} 
        style={{ marginBottom: 16 }}
      />

      <Button 
        title="Continue as Guest" 
        onPress={handleGuestAuth} 
        theme={theme} 
        variant="card" 
        icon={<User color={theme.text} size={20} strokeWidth={2} />} 
        style={{ marginBottom: 32 }}
      />

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
        <Caption color={theme.textSecondary} style={styles.orText}>OR SIGN IN WITH</Caption>
        <View style={[styles.line, { backgroundColor: theme.border }]} />
      </View>
      
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <Button 
          title="Google" 
          onPress={handleGoogleAuth} 
          theme={theme} 
          variant="card" 
          icon={<GoogleIcon color={theme.text} size={20} />} 
          style={{ flex: 1 }}
        />
        <Button 
          title="Apple" 
          onPress={() => handleOAuth('apple')} 
          theme={theme} 
          variant="card" 
          icon={<AppleIcon color={theme.text} size={20} />} 
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );

  const renderEmailForm = () => (
    <View style={styles.sheetContent}>
      <Title color={theme.text} style={styles.sheetTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Title>
      <Body color={theme.textSecondary} style={styles.sheetSubtitle}>
        {isSignUp ? 'Sign up to start tracking your habits.' : 'Sign in to continue your habit journey.'}
      </Body>

      {isSignUp && (
        <View style={styles.inputContainer}>
          <Caption color={theme.textSecondary} style={styles.label}>NAME</Caption>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border }]}
            placeholder="User"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Caption color={theme.textSecondary} style={styles.label}>EMAIL</Caption>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="you@example.com"
          placeholderTextColor={theme.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Caption color={theme.textSecondary} style={styles.label}>PASSWORD</Caption>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="••••••••"
          placeholderTextColor={theme.textSecondary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <Button 
        title={loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')} 
        onPress={handleEmailAuth} 
        theme={theme} 
        variant="accent" 
        style={{ marginTop: 12 }}
      />

      <TouchableOpacity style={styles.switchBtn} onPress={() => setIsSignUp(!isSignUp)}>
        <Body color={theme.textSecondary} style={{ textAlign: 'center' }}>
          {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
        </Body>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderHome()}
      <BottomSheet visible={mode === 'email'} onClose={() => setMode('home')} theme={theme}>
        {renderEmailForm()}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: 24, paddingBottom: 60 },
  title: { fontSize: 40, marginBottom: 8 },
  subtitle: { marginBottom: 32 },
  sheetTitle: { marginBottom: 8 },
  sheetSubtitle: { marginBottom: 32 },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24
  },
  line: { flex: 1, height: 1 },
  orText: { marginHorizontal: 16 },
  iconButton: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  sheetContent: { paddingVertical: 10, paddingBottom: 20 },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 8, padding: 16, fontSize: 16 },
  switchBtn: { marginTop: 24, padding: 8 }
});
