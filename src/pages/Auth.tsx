
import React, { useState, useEffect } from 'react';
import LoadingHero from '@/components/LoadingHero';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Milk, Eye, EyeOff, AlertCircle, UserCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

 
const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRoleButtons, setShowRoleButtons] = useState(true);
  const [isFarmOwner, setIsFarmOwner] = useState(false);




  const [signInData, setSignInData] = useState({
    email: '',
    password: '',
  });

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    farmName: '',
    zone: '',
  });

if (loading) {
    return <LoadingHero onComplete={() => {}} />;
}



  if (user && !isGuestMode) {
    return <Navigate to="/" replace />;
  }




const handleSignIn = async (e: React.FormEvent) => {

    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signIn(signInData.email, signInData.password);
      
      if (error) {
        let errorMessage = 'An error occurred during sign in';
        
        // Handle common authentication errors
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
      
      if (error) {
        let errorMessage = 'An error occurred during sign up';
        
        // Handle common sign up errors
        if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('Unable to validate email address')) {
          errorMessage = 'Please enter a valid email address.';
        } else {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
        toast({
          title: "Sign Up Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Please check your email for a confirmation link to complete your registration.",
        });

        const { data: { user } } = await supabase.auth.getUser();

        // Collect farm information during sign up
        await supabase.from('profiles').insert(
          {
            id: user?.id,
            email: signUpData.email,
            phone: signUpData.phone,
            farm_name: signUpData.farmName,
            zone: signUpData.zone
          }
        );

        console.log('Farm information collected successfully', signUpData);

        // Reset form
        setSignUpData({ email: '', password: '', fullName: '', phone: '', farmName: '', zone: '' });
      }
    } catch (error: any) {
      const errorMessage = error?.message || "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    setIsGuestMode(true);
    toast({
      title: "Welcome Guest!",
      description: "You can explore the app features. Note that your data won't be saved.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Milk className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">TIWA Kilimo</h1>
          <p className="text-gray-600">Dairy Diary</p>
          <p className="text-sm text-gray-500 mt-2">Record. Reflect. Grow.</p>
        </div>

        {showRoleButtons && (
          <>
            <Button 
              id="btn-1"
              type="submit"
              className="w-full m-4"
              disabled={isLoading}
              onClick={() => {
                setShowForm(true)
                setShowRoleButtons(false);
                setIsFarmOwner(true);
              }}

            >
              Farm Owner
            </Button>
            <Button
              id="btn-2"
              type="submit"
              className="w-full m-4"
              disabled={isLoading} 
              onClick={() => {
                setShowForm(true)
                setShowRoleButtons(false);
              }}
            >
              Farm Worker
          </Button> 
          </>
        )}

        {showForm && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-lg">Welcome</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 6 characters"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        minLength={6}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Extra Fields for Farm Owner */}
                  {isFarmOwner && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={signUpData.phone}
                          onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-farmname">Farm Name</Label>
                        <Input
                          id="signup-farmname"
                          type="text"
                          placeholder="Enter your farm name"
                          value={signUpData.farmName}
                          onChange={(e) => setSignUpData({ ...signUpData, farmName: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-zone">Zone</Label>
                        <Input
                          id="signup-zone"
                          type="text"
                          placeholder="Enter your zone"
                          value={signUpData.zone}
                          onChange={(e) => setSignUpData({ ...signUpData, zone: e.target.value })}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>

            </Tabs>

            {/* Continue as Guest Option */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleContinueAsGuest}
                disabled={isLoading}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Continue as Guest
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Explore all features without creating an account
              </p>
            </div>
          </CardContent>
        </Card> )}
      </div>
    </div>
  );
};

export default Auth;
