
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Download, 
  Upload, 
  FileText, 
  Bell,
  Package,
  Users,
  Languages,
  HelpCircle,
  Shield,
  Database,
  MessageSquare,
  BookOpen,
  Cloud,
  Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import RoleBasedAccess from '@/components/RoleBasedAccess';
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/client";
// import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';


const More = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, userRole, signOut } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();


  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'sw' : 'en');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      console.error("Email is required");
      return;
    }

    try {
      // 1. Get the current logged-in user's ID
      const {
        data: { user: currentUser },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        console.error("Error fetching current user:", userError);
        return;
      }

      // 2. Get the target user ID from the email
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      let targetUserId = "";

      if (error) {
        console.error(error);
      } else {
        // Tell TypeScript explicitly what type `u` is
        const targetUser = data.users.find(
          (u: { email?: string | null }) => u.email === email
        );

        if (!targetUser) {
          console.error("User not found");
        } else {
          targetUserId = targetUser.id;
          console.log("User ID:", targetUser.id);
        }
      }

      // 3. Insert into user_roles
      const { error: insertError } = await supabase
        .from("user_roles")
        .insert([
          {
            user_id: targetUserId,          
            role: "worker",              
            assigned_by: currentUser.id,        
          }
        ]);

      if (insertError) {
        console.error("Error inserting into user_roles:", insertError);
        return;
      }

      console.log("Email and IDs successfully added to user_roles");

    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {t('more')}
          </h1>
          <Badge variant="outline">
            {userRole === 'owner' ? '👑 Owner' : '👷 Worker'}
          </Badge>
        </div>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/inventory">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Track feed, medicine, and equipment stock levels
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link to="/reminders">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Reminders & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Set up notifications for important farm activities
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Language / Lugha</h3>
                <p className="text-sm text-gray-600">
                  {language === 'en' ? 'Switch to Swahili' : 'Badili kwenda Kiingereza'}
                </p>
              </div>
              <Button variant="outline" onClick={handleLanguageToggle}>
                <Languages className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Kiswahili' : 'English'}
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-600">
                  Manage alert preferences and reminder settings
                </p>
              </div>
              <Button variant="outline" disabled>
                <Bell className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Theme Settings</h3>
                <p className="text-sm text-gray-600">
                  Customize app appearance and layout
                </p>
              </div>
              <Button variant="outline" disabled>
                <Smartphone className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Sync Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Backup & Sync Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Auto Backup</h3>
                <p className="text-sm text-gray-600">
                  Automatically backup your data to the cloud
                </p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Active
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Export Data</h3>
                <p className="text-sm text-gray-600">
                  Download your farm data as Excel or PDF
                </p>
              </div>
              <Button variant="outline" disabled>
                <Download className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Import Data</h3>
                <p className="text-sm text-gray-600">
                  Upload existing records from spreadsheets
                </p>
              </div>
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Coming Soon
              </Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Sync Status</h3>
                <p className="text-sm text-gray-600">
                  Check data synchronization status
                </p>
              </div>
              <Badge variant="outline" className="text-green-600 border-green-200">
                ✓ Synced
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Training & Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Training & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" disabled className="h-auto p-4 flex-col">
                <HelpCircle className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">User Guide</div>
                  <div className="text-sm text-gray-600">Step-by-step tutorials</div>
                </div>
              </Button>
              
              <Button variant="outline" disabled className="h-auto p-4 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Video Tutorials</div>
                  <div className="text-sm text-gray-600">Learn through videos</div>
                </div>
              </Button>
              
              <Button variant="outline" disabled className="h-auto p-4 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Live Support</div>
                  <div className="text-sm text-gray-600">Chat with our team</div>
                </div>
              </Button>
              
              <Button variant="outline" disabled className="h-auto p-4 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                <div className="text-center">
                  <div className="font-medium">Community</div>
                  <div className="text-sm text-gray-600">Connect with farmers</div>
                </div>
              </Button>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our support team is here to help you make the most of TIWA Kilimo Dairy Diary
              </p>
              <div className="flex gap-2">
                <Button size="sm" disabled>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button size="sm" variant="outline" disabled>
                  WhatsApp Help
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Feedback Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">
                Help Us Improve TIWA Kilimo
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Your feedback helps us build better tools for Kenyan dairy farmers
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button variant="outline" disabled className="h-auto p-3 flex-col">
                  <div className="font-medium">Feature Request</div>
                  <div className="text-xs text-gray-600">Suggest new features</div>
                </Button>
                
                <Button variant="outline" disabled className="h-auto p-3 flex-col">
                  <div className="font-medium">Report Bug</div>
                  <div className="text-xs text-gray-600">Report an issue</div>
                </Button>
                
                <Button variant="outline" disabled className="h-auto p-3 flex-col">
                  <div className="font-medium">General Feedback</div>
                  <div className="text-xs text-gray-600">Share your thoughts</div>
                </Button>
                
                <Button variant="outline" disabled className="h-auto p-3 flex-col">
                  <div className="font-medium">Rate the App</div>
                  <div className="text-xs text-gray-600">⭐⭐⭐⭐⭐</div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Admin Only Features */}
        <RoleBasedAccess allowedRoles={['owner']}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">User Management</h3>
                    <p className="text-sm text-gray-600">
                      Manage worker accounts and permissions
                    </p>
                  </div>
                  {/* New Button for Email Form */}
                  <div>
                    <Button
                      variant="outline"
                      onClick={() => setShowEmailForm(!showEmailForm)}
                    >
                      {showEmailForm ? 'Cancel' : 'Add worker'}
                    </Button>
                  </div>
                </div>
                {showEmailForm && (
                  <form onSubmit={handleEmailSubmit} className="mt-3 space-y-2">
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="Enter the worker's email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Button type="submit" className="w-full">
                      Save Email
                    </Button>
                  </form>
                )}
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Farm Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Advanced reporting and insights
                    </p>
                  </div>
                  <Button variant="outline" disabled>
                    <FileText className="h-4 w-4 mr-2" />
                    Coming Soon
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </RoleBasedAccess>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              App Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">TIWA Kilimo Dairy Diary</h3>
              <p className="text-sm text-blue-700">
                Version 2.0 - Comprehensive farm management for Kenyan dairy farmers
              </p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Animal registration and profile management</li>
                <li>Production, health, and breeding records</li>
                <li>Financial tracking with buyer/supplier details</li>
                <li>Inventory management with low-stock alerts</li>
                <li>Task management and reminders</li>
                <li>Multi-user support (Admin/Worker roles)</li>
                <li>Bilingual support (English/Swahili)</li>
              </ul>
            </div>

            {user && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Account:</strong> {user.email}
                </p>
                <p className="text-sm">
                  <strong>Role:</strong> {userRole}
                </p>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                if (user) {
                  // If user is logged in, sign them out
                  signOut();
                } else {
                  navigate("/auth"); 
                }
              }}
              className="w-full"
            >
              {user ? "Sign Out" : "Sign In"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default More;
